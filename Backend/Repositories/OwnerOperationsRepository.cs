using Npgsql;
using Nurapos.DTOs.Operations;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;

namespace Nurapos.Repositories;

public sealed class OwnerOperationsRepository : IOwnerOperationsRepository
{
    private readonly NpgsqlConnection _connection;
    public OwnerOperationsRepository(NpgsqlConnection connection) => _connection = connection;

    public async Task<List<OwnerPaymentMode>> GetPaymentModesAsync(int ownerId)
    {
        const string sql = "SELECT c_payment_mode_id, c_mode_name, c_status FROM t_owner_payment_mode WHERE c_user_id = @owner_id AND c_status = 'ACTIVE' ORDER BY c_mode_name;";
        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, _connection);
        command.Parameters.AddWithValue("@owner_id", ownerId);
        await using var reader = await command.ExecuteReaderAsync();
        var modes = new List<OwnerPaymentMode>();
        while (await reader.ReadAsync())
        {
            modes.Add(new OwnerPaymentMode
            {
                Id = reader.GetInt32(0),
                Name = reader.GetString(1),
                Status = reader.GetString(2)
            });
        }
        return modes;
    }

    public async Task<OwnerPaymentMode> CreatePaymentModeAsync(string name, int ownerId)
    {
        const string sql = "INSERT INTO t_owner_payment_mode (c_user_id, c_mode_name) VALUES (@owner_id, @name) RETURNING c_payment_mode_id, c_mode_name, c_status;";
        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, _connection);
        command.Parameters.AddWithValue("@owner_id", ownerId);
        command.Parameters.AddWithValue("@name", name);
        await using var reader = await command.ExecuteReaderAsync();
        await reader.ReadAsync();
        return new OwnerPaymentMode { Id = reader.GetInt32(0), Name = reader.GetString(1), Status = reader.GetString(2) };
    }

    public async Task<ExpenseRecord> CreateExpenseAsync(ExpenseRecord expense, int ownerId)
    {
        await OpenConnectionAsync();
        await using var transaction = await _connection.BeginTransactionAsync();
        await EnsureOwnedFranchiseAsync(expense.FranchiseId, ownerId, transaction);
        await EnsureOwnedExpenseCategoryAsync(expense.ExpenseCategoryId, ownerId, transaction);

        const string sql = """
            INSERT INTO t_expense
                (c_franchise_id, c_expense_category_id, c_user_id, c_expense_date,
                 c_expense_amount, c_description, c_payment_method, c_receipt_image)
            VALUES
                (@franchise_id, @category_id, @owner_id, @expense_date,
                 @amount, @description, @payment_method, @receipt_image)
            RETURNING c_expense_id, c_franchise_id, c_expense_category_id, c_user_id,
                      c_expense_date, c_expense_amount, c_description, c_payment_method,
                      c_receipt_image, c_created_at;
            """;

        await using var command = new NpgsqlCommand(sql, _connection, transaction);
        command.Parameters.AddWithValue("@franchise_id", expense.FranchiseId);
        command.Parameters.AddWithValue("@category_id", expense.ExpenseCategoryId);
        command.Parameters.AddWithValue("@owner_id", ownerId);
        command.Parameters.AddWithValue("@expense_date", expense.ExpenseDate.Date);
        command.Parameters.AddWithValue("@amount", expense.Amount);
        command.Parameters.AddWithValue("@description", (object?)expense.Description ?? DBNull.Value);
        command.Parameters.AddWithValue("@payment_method", expense.PaymentMethod);
        command.Parameters.AddWithValue("@receipt_image", (object?)expense.ReceiptImage ?? DBNull.Value);
        await using var reader = await command.ExecuteReaderAsync();
        await reader.ReadAsync();
        var result = MapExpense(reader);
        await reader.DisposeAsync();
        await transaction.CommitAsync();
        return result;
    }

    public async Task<List<ExpenseRecord>> GetExpensesAsync(int ownerId, int? franchiseId)
    {
        const string sql = """
            SELECT e.c_expense_id, e.c_franchise_id, e.c_expense_category_id, e.c_user_id,
                   e.c_expense_date, e.c_expense_amount, e.c_description, e.c_payment_method,
                   e.c_receipt_image, e.c_created_at
            FROM t_expense e JOIN t_franchise f ON f.c_franchise_id = e.c_franchise_id
            WHERE f.c_user_id = @owner_id AND (@franchise_id IS NULL OR e.c_franchise_id = @franchise_id)
            ORDER BY e.c_expense_date DESC, e.c_expense_id DESC;
            """;
        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, _connection);
        command.Parameters.AddWithValue("@owner_id", ownerId);
        command.Parameters.AddWithValue("@franchise_id", (object?)franchiseId ?? DBNull.Value);
        await using var reader = await command.ExecuteReaderAsync();
        var records = new List<ExpenseRecord>();
        while (await reader.ReadAsync()) records.Add(MapExpense(reader));
        return records;
    }

    public async Task<BillRecord> CreateSaleAsync(SaleRequest request, int ownerId)
    {
        await OpenConnectionAsync();
        await using var transaction = await _connection.BeginTransactionAsync();
        await EnsureOwnedFranchiseAsync(request.FranchiseId, ownerId, transaction);
        await EnsureActivePaymentModeAsync(request.PaymentMethod, ownerId, transaction);

        const string saleSql = """
            INSERT INTO t_sale (c_franchise_id, c_user_id, c_sale_date, c_payment_method, c_total_amount, c_status)
            VALUES (@franchise_id, @owner_id, CURRENT_DATE, @payment_method, 0, 'COMPLETED')
            RETURNING c_sale_id;
            """;
        await using var saleCommand = new NpgsqlCommand(saleSql, _connection, transaction);
        saleCommand.Parameters.AddWithValue("@franchise_id", request.FranchiseId);
        saleCommand.Parameters.AddWithValue("@owner_id", ownerId);
        saleCommand.Parameters.AddWithValue("@payment_method", request.PaymentMethod);
        var saleId = Convert.ToInt32(await saleCommand.ExecuteScalarAsync());

        decimal total = 0;
        foreach (var line in request.Items)
        {
            const string stockSql = """
                UPDATE t_franchise_product fp
                SET c_stock_quantity = fp.c_stock_quantity - @quantity
                FROM t_franchise f, t_product p
                WHERE fp.c_franchise_id = @franchise_id
                  AND fp.c_product_id = @product_id
                  AND fp.c_status = 'ACTIVE'
                  AND fp.c_stock_quantity >= @quantity
                  AND f.c_franchise_id = fp.c_franchise_id AND f.c_user_id = @owner_id
                  AND p.c_product_id = fp.c_product_id AND p.c_user_id = @owner_id AND p.c_status = 'ACTIVE'
                RETURNING fp.c_selling_price;
                """;
            await using var stockCommand = new NpgsqlCommand(stockSql, _connection, transaction);
            stockCommand.Parameters.AddWithValue("@quantity", line.Quantity);
            stockCommand.Parameters.AddWithValue("@franchise_id", request.FranchiseId);
            stockCommand.Parameters.AddWithValue("@product_id", line.ProductId);
            stockCommand.Parameters.AddWithValue("@owner_id", ownerId);
            var priceValue = await stockCommand.ExecuteScalarAsync();
            if (priceValue == null || priceValue == DBNull.Value)
                throw new InvalidOperationException("Product is not assigned to this franchise or stock is insufficient.");

            var unitPrice = Convert.ToDecimal(priceValue);
            var lineTotal = decimal.Round(unitPrice * line.Quantity, 2);
            total += lineTotal;
            const string detailSql = """
                INSERT INTO t_sale_detail (c_sale_id, c_product_id, c_quantity, c_unit_price, c_total_amount)
                VALUES (@sale_id, @product_id, @quantity, @unit_price, @total);
                """;
            await using var detailCommand = new NpgsqlCommand(detailSql, _connection, transaction);
            detailCommand.Parameters.AddWithValue("@sale_id", saleId);
            detailCommand.Parameters.AddWithValue("@product_id", line.ProductId);
            detailCommand.Parameters.AddWithValue("@quantity", line.Quantity);
            detailCommand.Parameters.AddWithValue("@unit_price", unitPrice);
            detailCommand.Parameters.AddWithValue("@total", lineTotal);
            await detailCommand.ExecuteNonQueryAsync();
        }

        await UpdateSaleTotalAsync(saleId, total, transaction);
        await CreatePaymentAsync(request.FranchiseId, "SALE", saleId, request.PaymentMethod, total, transaction);
        await transaction.CommitAsync();
        return await GetBillByIdAsync("sale", saleId, ownerId)
            ?? throw new InvalidOperationException("Generated sale could not be retrieved.");
    }

    public Task<List<BillRecord>> GetSalesAsync(int ownerId, int? franchiseId) =>
        GetBillsAsync("sale", ownerId, franchiseId);

    public Task<BillRecord?> GetSaleAsync(int saleId, int ownerId) =>
        GetBillByIdAsync("sale", saleId, ownerId);

    public async Task<BillRecord> CreatePurchaseAsync(PurchaseRequest request, int ownerId)
    {
        await OpenConnectionAsync();
        await using var transaction = await _connection.BeginTransactionAsync();
        await EnsureOwnedFranchiseAsync(request.FranchiseId, ownerId, transaction);
        if (request.SupplierId.HasValue)
            await EnsureOwnedSupplierAsync(request.SupplierId.Value, ownerId, transaction);

        const string purchaseSql = """
            INSERT INTO t_purchase (c_franchise_id, c_supplier_id, c_purchase_date, c_total_amount, c_payment_method, c_status)
            VALUES (@franchise_id, @supplier_id, CURRENT_DATE, 0, @payment_method, 'COMPLETED')
            RETURNING c_purchase_id;
            """;
        await using var purchaseCommand = new NpgsqlCommand(purchaseSql, _connection, transaction);
        purchaseCommand.Parameters.AddWithValue("@franchise_id", request.FranchiseId);
        purchaseCommand.Parameters.AddWithValue("@supplier_id", (object?)request.SupplierId ?? DBNull.Value);
        purchaseCommand.Parameters.AddWithValue("@payment_method", request.PaymentMethod);
        var purchaseId = Convert.ToInt32(await purchaseCommand.ExecuteScalarAsync());

        decimal total = 0;
        foreach (var line in request.Items)
        {
            const string stockSql = """
                INSERT INTO t_franchise_product (c_franchise_id, c_product_id, c_stock_quantity, c_selling_price, c_status)
                SELECT @franchise_id, p.c_product_id, @quantity, p.c_selling_price, 'ACTIVE'
                FROM t_product p
                WHERE p.c_product_id = @product_id AND p.c_user_id = @owner_id AND p.c_status = 'ACTIVE'
                  AND EXISTS (SELECT 1 FROM t_franchise f WHERE f.c_franchise_id = @franchise_id AND f.c_user_id = @owner_id)
                ON CONFLICT (c_franchise_id, c_product_id)
                DO UPDATE SET c_stock_quantity = t_franchise_product.c_stock_quantity + EXCLUDED.c_stock_quantity
                RETURNING c_product_id;
                """;
            await using var stockCommand = new NpgsqlCommand(stockSql, _connection, transaction);
            stockCommand.Parameters.AddWithValue("@franchise_id", request.FranchiseId);
            stockCommand.Parameters.AddWithValue("@product_id", line.ProductId);
            stockCommand.Parameters.AddWithValue("@owner_id", ownerId);
            stockCommand.Parameters.AddWithValue("@quantity", line.Quantity);
            if (await stockCommand.ExecuteScalarAsync() == null)
                throw new KeyNotFoundException("Product not found for this owner.");

            var lineTotal = decimal.Round(line.UnitPrice * line.Quantity, 2);
            total += lineTotal;
            const string detailSql = """
                INSERT INTO t_purchase_detail (c_purchase_id, c_product_id, c_quantity, c_unit_price, c_total_amount)
                VALUES (@purchase_id, @product_id, @quantity, @unit_price, @total);
                """;
            await using var detailCommand = new NpgsqlCommand(detailSql, _connection, transaction);
            detailCommand.Parameters.AddWithValue("@purchase_id", purchaseId);
            detailCommand.Parameters.AddWithValue("@product_id", line.ProductId);
            detailCommand.Parameters.AddWithValue("@quantity", line.Quantity);
            detailCommand.Parameters.AddWithValue("@unit_price", line.UnitPrice);
            detailCommand.Parameters.AddWithValue("@total", lineTotal);
            await detailCommand.ExecuteNonQueryAsync();
        }

        const string updateTotalSql = "UPDATE t_purchase SET c_total_amount = @total WHERE c_purchase_id = @id;";
        await using (var update = new NpgsqlCommand(updateTotalSql, _connection, transaction))
        {
            update.Parameters.AddWithValue("@total", total);
            update.Parameters.AddWithValue("@id", purchaseId);
            await update.ExecuteNonQueryAsync();
        }
        if (!string.Equals(request.PaymentMethod, "CREDIT", StringComparison.OrdinalIgnoreCase))
            await CreatePaymentAsync(request.FranchiseId, "PURCHASE", purchaseId, request.PaymentMethod, total, transaction);
        await transaction.CommitAsync();
        return await GetBillByIdAsync("purchase", purchaseId, ownerId)
            ?? throw new InvalidOperationException("Generated purchase could not be retrieved.");
    }

    public Task<List<BillRecord>> GetPurchasesAsync(int ownerId, int? franchiseId) =>
        GetBillsAsync("purchase", ownerId, franchiseId);

    public Task<BillRecord?> GetPurchaseAsync(int purchaseId, int ownerId) =>
        GetBillByIdAsync("purchase", purchaseId, ownerId);

    public async Task<List<FranchiseProductRecord>> GetInventoryAsync(int franchiseId, int ownerId)
    {
        const string sql = """
            SELECT fp.c_franchise_product_id, fp.c_franchise_id, fp.c_product_id,
                   p.c_product_name, fp.c_stock_quantity, fp.c_selling_price, fp.c_status
            FROM t_franchise_product fp
            JOIN t_franchise f ON f.c_franchise_id = fp.c_franchise_id
            JOIN t_product p ON p.c_product_id = fp.c_product_id
            WHERE fp.c_franchise_id = @franchise_id AND f.c_user_id = @owner_id
              AND p.c_user_id = @owner_id
            ORDER BY p.c_product_name;
            """;
        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, _connection);
        command.Parameters.AddWithValue("@franchise_id", franchiseId);
        command.Parameters.AddWithValue("@owner_id", ownerId);
        await using var reader = await command.ExecuteReaderAsync();
        var items = new List<FranchiseProductRecord>();
        while (await reader.ReadAsync()) items.Add(MapFranchiseProduct(reader));
        return items;
    }

    public async Task<FranchiseProductRecord?> SetInventoryAsync(
        int franchiseId,
        int productId,
        FranchiseProductRequest request,
        int ownerId)
    {
        const string upsertSql = """
            INSERT INTO t_franchise_product
                (c_franchise_id, c_product_id, c_stock_quantity, c_selling_price, c_status)
            SELECT @franchise_id, p.c_product_id, @stock_quantity,
                   COALESCE(@selling_price, p.c_selling_price), @status
            FROM t_product p
            WHERE p.c_product_id = @product_id AND p.c_user_id = @owner_id
              AND EXISTS (SELECT 1 FROM t_franchise f WHERE f.c_franchise_id = @franchise_id AND f.c_user_id = @owner_id)
            ON CONFLICT (c_franchise_id, c_product_id)
            DO UPDATE SET c_stock_quantity = EXCLUDED.c_stock_quantity,
                          c_selling_price = EXCLUDED.c_selling_price,
                          c_status = EXCLUDED.c_status
            RETURNING c_franchise_product_id;
            """;
        await OpenConnectionAsync();
        int? id;
        await using (var command = new NpgsqlCommand(upsertSql, _connection))
        {
            command.Parameters.AddWithValue("@franchise_id", franchiseId);
            command.Parameters.AddWithValue("@product_id", productId);
            command.Parameters.AddWithValue("@owner_id", ownerId);
            command.Parameters.AddWithValue("@stock_quantity", request.StockQuantity);
            command.Parameters.AddWithValue("@selling_price", (object?)request.SellingPrice ?? DBNull.Value);
            command.Parameters.AddWithValue("@status", request.Status.Trim().ToUpperInvariant());
            var result = await command.ExecuteScalarAsync();
            id = result == null || result == DBNull.Value ? null : Convert.ToInt32(result);
        }
        if (!id.HasValue) return null;

        const string getSql = """
            SELECT fp.c_franchise_product_id, fp.c_franchise_id, fp.c_product_id,
                   p.c_product_name, fp.c_stock_quantity, fp.c_selling_price, fp.c_status
            FROM t_franchise_product fp JOIN t_product p ON p.c_product_id = fp.c_product_id
            JOIN t_franchise f ON f.c_franchise_id = fp.c_franchise_id
            WHERE fp.c_franchise_product_id = @id AND f.c_user_id = @owner_id AND p.c_user_id = @owner_id;
            """;
        await using var getCommand = new NpgsqlCommand(getSql, _connection);
        getCommand.Parameters.AddWithValue("@id", id.Value);
        getCommand.Parameters.AddWithValue("@owner_id", ownerId);
        await using var reader = await getCommand.ExecuteReaderAsync();
        return await reader.ReadAsync() ? MapFranchiseProduct(reader) : null;
    }

    public async Task<List<PaymentRecord>> GetPaymentsAsync(int ownerId, int? franchiseId)
    {
        const string sql = """
            SELECT p.c_payment_id, p.c_franchise_id, p.c_reference_type, p.c_reference_id,
                   p.c_payment_method, p.c_payment_amount, p.c_payment_date, p.c_payment_status
            FROM t_payment p JOIN t_franchise f ON f.c_franchise_id = p.c_franchise_id
            WHERE f.c_user_id = @owner_id AND (@franchise_id IS NULL OR p.c_franchise_id = @franchise_id)
            ORDER BY p.c_payment_date DESC, p.c_payment_id DESC;
            """;
        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, _connection);
        command.Parameters.AddWithValue("@owner_id", ownerId);
        command.Parameters.AddWithValue("@franchise_id", (object?)franchiseId ?? DBNull.Value);
        await using var reader = await command.ExecuteReaderAsync();
        var items = new List<PaymentRecord>();
        while (await reader.ReadAsync())
        {
            items.Add(new PaymentRecord
            {
                PaymentId = reader.GetInt32(0), FranchiseId = reader.GetInt32(1),
                ReferenceType = reader.GetString(2), ReferenceId = reader.GetInt32(3),
                PaymentMethod = reader.GetString(4), Amount = reader.GetDecimal(5),
                PaymentDate = reader.GetDateTime(6), Status = reader.GetString(7)
            });
        }
        return items;
    }

    public async Task<List<DailySummaryRecord>> GetDailySummariesAsync(int ownerId, int? franchiseId)
    {
        const string sql = """
            SELECT d.c_daily_summary_id, d.c_franchise_id, d.c_summary_date,
                   d.c_total_sales, d.c_total_purchases, d.c_total_expenses,
                   d.c_gross_profit, d.c_net_profit
            FROM t_daily_summary d JOIN t_franchise f ON f.c_franchise_id = d.c_franchise_id
            WHERE f.c_user_id = @owner_id AND (@franchise_id IS NULL OR d.c_franchise_id = @franchise_id)
            ORDER BY d.c_summary_date DESC, d.c_daily_summary_id DESC;
            """;
        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, _connection);
        command.Parameters.AddWithValue("@owner_id", ownerId);
        command.Parameters.AddWithValue("@franchise_id", (object?)franchiseId ?? DBNull.Value);
        await using var reader = await command.ExecuteReaderAsync();
        var items = new List<DailySummaryRecord>();
        while (await reader.ReadAsync())
        {
            items.Add(new DailySummaryRecord
            {
                DailySummaryId = reader.GetInt32(0), FranchiseId = reader.GetInt32(1), SummaryDate = reader.GetDateTime(2),
                TotalSales = reader.GetDecimal(3), TotalPurchases = reader.GetDecimal(4), TotalExpenses = reader.GetDecimal(5),
                GrossProfit = reader.GetDecimal(6), NetProfit = reader.GetDecimal(7)
            });
        }
        return items;
    }

    private async Task<List<BillRecord>> GetBillsAsync(string kind, int ownerId, int? franchiseId)
    {
        var isSale = kind == "sale";
        var table = isSale ? "t_sale" : "t_purchase";
        var idColumn = isSale ? "c_sale_id" : "c_purchase_id";
        var dateColumn = isSale ? "c_sale_date" : "c_purchase_date";
        var userFilter = isSale ? " AND b.c_user_id = @owner_id" : string.Empty;
        var sql = $"""
            SELECT b.{idColumn} AS id, b.c_franchise_id AS franchise_id,
                   {(isSale ? "NULL::integer" : "b.c_supplier_id")} AS supplier_id,
                   b.{dateColumn} AS bill_date, b.c_total_amount AS total_amount,
                   b.c_payment_method AS payment_method, b.c_status AS status
            FROM {table} b JOIN t_franchise f ON f.c_franchise_id = b.c_franchise_id
            WHERE f.c_user_id = @owner_id AND (@franchise_id IS NULL OR b.c_franchise_id = @franchise_id){userFilter}
            ORDER BY b.{dateColumn} DESC, b.{idColumn} DESC;
            """;
        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, _connection);
        command.Parameters.AddWithValue("@owner_id", ownerId);
        command.Parameters.AddWithValue("@franchise_id", (object?)franchiseId ?? DBNull.Value);
        await using var reader = await command.ExecuteReaderAsync();
        var records = new List<BillRecord>();
        while (await reader.ReadAsync()) records.Add(MapBill(reader));
        return records;
    }

    private async Task<BillRecord?> GetBillByIdAsync(string kind, int id, int ownerId)
    {
        var isSale = kind == "sale";
        var table = isSale ? "t_sale" : "t_purchase";
        var idColumn = isSale ? "c_sale_id" : "c_purchase_id";
        var dateColumn = isSale ? "c_sale_date" : "c_purchase_date";
        var detailsTable = isSale ? "t_sale_detail" : "t_purchase_detail";
        var detailsId = isSale ? "c_sale_id" : "c_purchase_id";
        var userFilter = isSale ? " AND b.c_user_id = @owner_id" : string.Empty;
        var sql = $"""
            SELECT b.{idColumn} AS id, b.c_franchise_id AS franchise_id,
                   {(isSale ? "NULL::integer" : "b.c_supplier_id")} AS supplier_id,
                   b.{dateColumn} AS bill_date, b.c_total_amount AS total_amount,
                   b.c_payment_method AS payment_method, b.c_status AS status
            FROM {table} b JOIN t_franchise f ON f.c_franchise_id = b.c_franchise_id
            WHERE b.{idColumn} = @id AND f.c_user_id = @owner_id{userFilter};
            """;
        await OpenConnectionAsync();
        BillRecord? bill;
        await using (var command = new NpgsqlCommand(sql, _connection))
        {
            command.Parameters.AddWithValue("@id", id);
            command.Parameters.AddWithValue("@owner_id", ownerId);
            await using var reader = await command.ExecuteReaderAsync();
            bill = await reader.ReadAsync() ? MapBill(reader) : null;
        }
        if (bill == null) return null;

        var detailsSql = $"""
            SELECT d.c_product_id, p.c_product_name, d.c_quantity, d.c_unit_price, d.c_total_amount
            FROM {detailsTable} d JOIN t_product p ON p.c_product_id = d.c_product_id
            WHERE d.{detailsId} = @id ORDER BY d.{(isSale ? "c_sale_detail_id" : "c_purchase_detail_id")};
            """;
        await using (var command = new NpgsqlCommand(detailsSql, _connection))
        {
            command.Parameters.AddWithValue("@id", id);
            await using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                bill.Items.Add(new BillLineRecord
                {
                    ProductId = reader.GetInt32(0),
                    ProductName = reader.GetString(1),
                    Quantity = reader.GetDecimal(2),
                    UnitPrice = reader.GetDecimal(3),
                    TotalAmount = reader.GetDecimal(4)
                });
            }
        }
        return bill;
    }

    private async Task EnsureOwnedFranchiseAsync(int franchiseId, int ownerId, NpgsqlTransaction transaction)
    {
        const string sql = "SELECT EXISTS(SELECT 1 FROM t_franchise WHERE c_franchise_id=@id AND c_user_id=@owner_id);";
        await using var command = new NpgsqlCommand(sql, _connection, transaction);
        command.Parameters.AddWithValue("@id", franchiseId);
        command.Parameters.AddWithValue("@owner_id", ownerId);
        if (!Convert.ToBoolean(await command.ExecuteScalarAsync()))
            throw new KeyNotFoundException("Franchise not found for this owner.");
    }

    private async Task EnsureActivePaymentModeAsync(string modeName, int ownerId, NpgsqlTransaction transaction)
    {
        const string sql = "SELECT EXISTS(SELECT 1 FROM t_owner_payment_mode WHERE c_user_id = @owner_id AND LOWER(c_mode_name) = LOWER(@name) AND c_status = 'ACTIVE');";
        await using var command = new NpgsqlCommand(sql, _connection, transaction);
        command.Parameters.AddWithValue("@owner_id", ownerId);
        command.Parameters.AddWithValue("@name", modeName);
        if (!Convert.ToBoolean(await command.ExecuteScalarAsync()))
            throw new KeyNotFoundException("Select an active payment mode configured for this owner.");
    }

    private async Task EnsureOwnedExpenseCategoryAsync(int categoryId, int ownerId, NpgsqlTransaction transaction)
    {
        const string sql = "SELECT EXISTS(SELECT 1 FROM t_expense_category WHERE c_expense_category_id=@id AND c_user_id=@owner_id);";
        await using var command = new NpgsqlCommand(sql, _connection, transaction);
        command.Parameters.AddWithValue("@id", categoryId);
        command.Parameters.AddWithValue("@owner_id", ownerId);
        if (!Convert.ToBoolean(await command.ExecuteScalarAsync()))
            throw new KeyNotFoundException("Expense category not found for this owner.");
    }

    private async Task EnsureOwnedSupplierAsync(int supplierId, int ownerId, NpgsqlTransaction transaction)
    {
        const string sql = "SELECT EXISTS(SELECT 1 FROM t_supplier WHERE c_supplier_id=@id AND c_user_id=@owner_id);";
        await using var command = new NpgsqlCommand(sql, _connection, transaction);
        command.Parameters.AddWithValue("@id", supplierId);
        command.Parameters.AddWithValue("@owner_id", ownerId);
        if (!Convert.ToBoolean(await command.ExecuteScalarAsync()))
            throw new KeyNotFoundException("Supplier not found for this owner.");
    }

    private static async Task UpdateSaleTotalAsync(int saleId, decimal total, NpgsqlTransaction transaction)
    {
        const string sql = "UPDATE t_sale SET c_total_amount=@total WHERE c_sale_id=@id;";
        await using var command = new NpgsqlCommand(sql, transaction.Connection, transaction);
        command.Parameters.AddWithValue("@total", total);
        command.Parameters.AddWithValue("@id", saleId);
        await command.ExecuteNonQueryAsync();
    }

    private static async Task CreatePaymentAsync(int franchiseId, string referenceType, int referenceId, string method, decimal amount, NpgsqlTransaction transaction)
    {
        const string sql = """
            INSERT INTO t_payment (c_franchise_id, c_reference_type, c_reference_id, c_payment_method, c_payment_amount)
            VALUES (@franchise_id, @reference_type, @reference_id, @method, @amount);
            """;
        await using var command = new NpgsqlCommand(sql, transaction.Connection, transaction);
        command.Parameters.AddWithValue("@franchise_id", franchiseId);
        command.Parameters.AddWithValue("@reference_type", referenceType);
        command.Parameters.AddWithValue("@reference_id", referenceId);
        command.Parameters.AddWithValue("@method", method);
        command.Parameters.AddWithValue("@amount", amount);
        await command.ExecuteNonQueryAsync();
    }

    private async Task OpenConnectionAsync()
    {
        if (_connection.State != System.Data.ConnectionState.Open)
            await _connection.OpenAsync();
    }

    private static ExpenseRecord MapExpense(NpgsqlDataReader reader) => new()
    {
        ExpenseId = reader.GetInt32(reader.GetOrdinal("c_expense_id")),
        FranchiseId = reader.GetInt32(reader.GetOrdinal("c_franchise_id")),
        ExpenseCategoryId = reader.GetInt32(reader.GetOrdinal("c_expense_category_id")),
        UserId = reader.IsDBNull(reader.GetOrdinal("c_user_id")) ? null : reader.GetInt32(reader.GetOrdinal("c_user_id")),
        ExpenseDate = reader.GetDateTime(reader.GetOrdinal("c_expense_date")),
        Amount = reader.GetDecimal(reader.GetOrdinal("c_expense_amount")),
        Description = reader.IsDBNull(reader.GetOrdinal("c_description")) ? null : reader.GetString(reader.GetOrdinal("c_description")),
        PaymentMethod = reader.GetString(reader.GetOrdinal("c_payment_method")),
        ReceiptImage = reader.IsDBNull(reader.GetOrdinal("c_receipt_image")) ? null : reader.GetString(reader.GetOrdinal("c_receipt_image")),
        CreatedAt = reader.GetDateTime(reader.GetOrdinal("c_created_at"))
    };

    private static FranchiseProductRecord MapFranchiseProduct(NpgsqlDataReader reader) => new()
    {
        FranchiseProductId = reader.GetInt32(0), FranchiseId = reader.GetInt32(1), ProductId = reader.GetInt32(2),
        ProductName = reader.GetString(3), StockQuantity = reader.GetDecimal(4),
        SellingPrice = reader.IsDBNull(5) ? null : reader.GetDecimal(5), Status = reader.GetString(6)
    };

    private static BillRecord MapBill(NpgsqlDataReader reader) => new()
    {
        Id = reader.GetInt32(reader.GetOrdinal("id")),
        FranchiseId = reader.GetInt32(reader.GetOrdinal("franchise_id")),
        SupplierId = reader.IsDBNull(reader.GetOrdinal("supplier_id")) ? null : reader.GetInt32(reader.GetOrdinal("supplier_id")),
        Date = reader.GetDateTime(reader.GetOrdinal("bill_date")),
        TotalAmount = reader.GetDecimal(reader.GetOrdinal("total_amount")),
        PaymentMethod = reader.GetString(reader.GetOrdinal("payment_method")),
        Status = reader.GetString(reader.GetOrdinal("status"))
    };
}
