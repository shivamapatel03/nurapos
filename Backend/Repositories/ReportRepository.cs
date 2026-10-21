using Npgsql;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;

namespace Nurapos.Repositories;

public sealed class ReportRepository(NpgsqlConnection connection):IReportRepository
{
    public async Task<(IReadOnlyList<TaxSlabBreakdown> Sales,IReadOnlyList<TaxSlabBreakdown> Purchases)> GetTaxTotalsAsync(int ownerId,int franchiseId,DateOnly from,DateOnly to)
    {
        const string sql="""
            SELECT 'SALE' AS kind,d.c_tax_rate AS rate,SUM(d.c_total_amount-d.c_tax_amount) AS taxable,
                SUM(d.c_tax_amount) AS tax_amount
            FROM t_sale_detail d JOIN t_sale s ON s.c_sale_id=d.c_sale_id JOIN t_product p ON p.c_product_id=d.c_product_id
            WHERE s.c_user_id=@owner AND s.c_franchise_id=@franchise AND s.c_sale_date BETWEEN @from AND @to AND s.c_status='COMPLETED'
            GROUP BY d.c_tax_rate
            UNION ALL
            SELECT 'PURCHASE',d.c_tax_rate,SUM(d.c_total_amount-d.c_tax_amount),SUM(d.c_tax_amount)
            FROM t_purchase_detail d JOIN t_purchase b ON b.c_purchase_id=d.c_purchase_id JOIN t_product p ON p.c_product_id=d.c_product_id
            JOIN t_franchise f ON f.c_franchise_id=b.c_franchise_id
            WHERE f.c_user_id=@owner AND b.c_franchise_id=@franchise AND b.c_purchase_date BETWEEN @from AND @to AND b.c_status='COMPLETED'
            GROUP BY d.c_tax_rate ORDER BY kind,rate;
            """;
        await OpenAsync();await using var cmd=new NpgsqlCommand(sql,connection);AddRange(cmd,ownerId,franchiseId,from,to);
        await using var r=await cmd.ExecuteReaderAsync();var sales=new List<TaxSlabBreakdown>();var purchases=new List<TaxSlabBreakdown>();
        while(await r.ReadAsync()){var row=new TaxSlabBreakdown{TaxRate=r.GetDecimal(1),TaxableAmount=r.GetDecimal(2),TaxAmount=decimal.Round(r.GetDecimal(3),2,MidpointRounding.AwayFromZero)};(r.GetString(0)=="SALE"?sales:purchases).Add(row);}
        return(sales,purchases);
    }

    public async Task<(decimal Sales,decimal Expenses,decimal Cogs)> GetProfitLossAsync(int ownerId,int franchiseId,DateOnly from,DateOnly to)
    {
        const string sql="""
            SELECT
              COALESCE((SELECT SUM(s.c_total_amount) FROM t_sale s WHERE s.c_user_id=@owner AND s.c_franchise_id=@franchise AND s.c_sale_date BETWEEN @from AND @to AND s.c_status='COMPLETED'),0),
              COALESCE((SELECT SUM(e.c_expense_amount) FROM t_expense e WHERE e.c_user_id=@owner AND e.c_franchise_id=@franchise AND e.c_expense_date BETWEEN @from AND @to),0),
              COALESCE((SELECT SUM(d.c_quantity*CASE WHEN d.c_unit_cost=0 THEN p.c_cost_price ELSE d.c_unit_cost END) FROM t_sale_detail d JOIN t_sale s ON s.c_sale_id=d.c_sale_id JOIN t_product p ON p.c_product_id=d.c_product_id
            WHERE s.c_user_id=@owner AND s.c_franchise_id=@franchise AND s.c_sale_date BETWEEN @from AND @to AND s.c_status='COMPLETED'),0);
            """;
        await OpenAsync();await using var cmd=new NpgsqlCommand(sql,connection);AddRange(cmd,ownerId,franchiseId,from,to);
        await using var r=await cmd.ExecuteReaderAsync();await r.ReadAsync();return(r.GetDecimal(0),r.GetDecimal(1),r.GetDecimal(2));
    }

    public async Task<IReadOnlyList<ZReportRecord>> GetZReportsAsync(int ownerId,int franchiseId,DateOnly from,DateOnly to)
    {
        const string sql="""
            SELECT c_shift_id,c_terminal_code,c_cashier_id,c_opened_at,c_closed_at,c_status,c_opening_float,c_expected_cash,c_actual_cash,c_cash_difference,
                   c_total_sales,c_cash_sales,c_card_sales,c_upi_sales
            FROM t_register_shift WHERE c_user_id=@owner AND c_franchise_id=@franchise AND c_z_report_generated=TRUE AND c_opened_at::date BETWEEN @from AND @to
            ORDER BY c_opened_at DESC;
            """;
        await OpenAsync();await using var cmd=new NpgsqlCommand(sql,connection);AddRange(cmd,ownerId,franchiseId,from,to);await using var r=await cmd.ExecuteReaderAsync();
        var rows=new List<ZReportRecord>();while(await r.ReadAsync())rows.Add(new ZReportRecord{ShiftId=r.GetString(0),TerminalId=r.GetString(1),CashierId=r.GetInt32(2),OpenedAtUtc=r.GetDateTime(3),ClosedAtUtc=r.IsDBNull(4)?null:r.GetDateTime(4),Status=r.GetString(5),OpeningFloat=r.GetDecimal(6),ExpectedCash=r.IsDBNull(7)?null:r.GetDecimal(7),ActualCash=r.IsDBNull(8)?null:r.GetDecimal(8),CashDifference=r.IsDBNull(9)?null:r.GetDecimal(9),TotalSales=r.GetDecimal(10),CashTotal=r.GetDecimal(11),CardTotal=r.GetDecimal(12),UpiTotal=r.GetDecimal(13)});return rows;
    }

    public async Task<InventoryValuationReport> GetInventoryValuationAsync(int ownerId,int franchiseId)
    {
        const string sql="""
            SELECT p.c_product_id,p.c_product_name,fp.c_stock_quantity,p.c_cost_price,fp.c_reorder_level
            FROM t_franchise_product fp JOIN t_product p ON p.c_product_id=fp.c_product_id
            JOIN t_franchise f ON f.c_franchise_id=fp.c_franchise_id
            WHERE f.c_user_id=@owner AND p.c_user_id=@owner AND fp.c_franchise_id=@franchise AND fp.c_status='ACTIVE'
            ORDER BY p.c_product_name;
            """;
        await OpenAsync();await using var cmd=new NpgsqlCommand(sql,connection);cmd.Parameters.AddWithValue("@owner",ownerId);cmd.Parameters.AddWithValue("@franchise",franchiseId);await using var r=await cmd.ExecuteReaderAsync();
        var lines=new List<InventoryValuationLine>();decimal total=0;while(await r.ReadAsync()){var qty=r.GetDecimal(2);var cost=r.IsDBNull(3)?0m:r.GetDecimal(3);var reorder=r.GetDecimal(4);var value=qty*cost;total+=value;lines.Add(new InventoryValuationLine{ProductId=r.GetInt32(0),ProductName=r.GetString(1),Quantity=qty,CostPrice=cost,Value=value,ReorderLevel=reorder,IsLowStock=qty<=reorder});}
        return new InventoryValuationReport{TotalValue=total,Items=lines,LowStockItems=lines.Count(x=>x.IsLowStock)};
    }

    private static void AddRange(NpgsqlCommand cmd,int ownerId,int franchiseId,DateOnly from,DateOnly to)
    {cmd.Parameters.AddWithValue("@owner",ownerId);cmd.Parameters.AddWithValue("@franchise",franchiseId);cmd.Parameters.AddWithValue("@from",from);cmd.Parameters.AddWithValue("@to",to);}
    private async Task OpenAsync(){if(connection.State!=System.Data.ConnectionState.Open)await connection.OpenAsync();}
}
