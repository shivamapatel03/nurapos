using Npgsql;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;

namespace Nurapos.Repositories;

public sealed class OwnerCatalogRepository : IOwnerCatalogRepository
{
    private readonly NpgsqlConnection _connection;

    public OwnerCatalogRepository(NpgsqlConnection connection) => _connection = connection;

    public async Task<List<OwnerCatalogItem>> GetAllAsync(OwnerCatalogType type, int userId)
    {
        var definition = GetDefinition(type);
        var sql = $"SELECT {SelectColumns(definition)} FROM {definition.Table} WHERE c_user_id = @user_id ORDER BY {definition.Id};";
        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, _connection);
        command.Parameters.AddWithValue("@user_id", userId);
        await using var reader = await command.ExecuteReaderAsync();
        var items = new List<OwnerCatalogItem>();
        while (await reader.ReadAsync()) items.Add(Map(reader));
        return items;
    }

    public async Task<OwnerCatalogItem?> GetByIdAsync(OwnerCatalogType type, int id, int userId)
    {
        var definition = GetDefinition(type);
        var sql = $"SELECT {SelectColumns(definition)} FROM {definition.Table} WHERE {definition.Id} = @id AND c_user_id = @user_id;";
        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, _connection);
        command.Parameters.AddWithValue("@id", id);
        command.Parameters.AddWithValue("@user_id", userId);
        await using var reader = await command.ExecuteReaderAsync();
        return await reader.ReadAsync() ? Map(reader) : null;
    }

    public async Task<int> CreateAsync(OwnerCatalogType type, OwnerCatalogItem item, int userId)
    {
        await EnsureOwnedCategoryAsync(type, item.CategoryId, userId);
        var definition = GetDefinition(type);
        var (columns, values) = GetWriteColumns(type);
        var sql = $"INSERT INTO {definition.Table} (c_user_id, {columns}) VALUES (@user_id, {values}) RETURNING {definition.Id};";
        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, _connection);
        AddWriteParameters(command, type, item, userId);
        return Convert.ToInt32(await command.ExecuteScalarAsync());
    }

    public async Task<bool> UpdateAsync(OwnerCatalogType type, int id, OwnerCatalogItem item, int userId)
    {
        await EnsureOwnedCategoryAsync(type, item.CategoryId, userId);
        var definition = GetDefinition(type);
        var assignments = GetUpdateAssignments(type);
        var sql = $"UPDATE {definition.Table} SET {assignments} WHERE {definition.Id} = @id AND c_user_id = @user_id;";
        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, _connection);
        command.Parameters.AddWithValue("@id", id);
        AddWriteParameters(command, type, item, userId);
        return await command.ExecuteNonQueryAsync() > 0;
    }

    public async Task<bool> DeleteAsync(OwnerCatalogType type, int id, int userId)
    {
        var definition = GetDefinition(type);
        var sql = $"DELETE FROM {definition.Table} WHERE {definition.Id} = @id AND c_user_id = @user_id;";
        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, _connection);
        command.Parameters.AddWithValue("@id", id);
        command.Parameters.AddWithValue("@user_id", userId);
        return await command.ExecuteNonQueryAsync() > 0;
    }

    private async Task EnsureOwnedCategoryAsync(OwnerCatalogType type, int? categoryId, int userId)
    {
        if (type != OwnerCatalogType.Product || !categoryId.HasValue) return;

        const string sql = "SELECT EXISTS(SELECT 1 FROM t_category WHERE c_category_id = @id AND c_user_id = @user_id);";
        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, _connection);
        command.Parameters.AddWithValue("@id", categoryId.Value);
        command.Parameters.AddWithValue("@user_id", userId);
        if (!Convert.ToBoolean(await command.ExecuteScalarAsync()))
        {
            throw new KeyNotFoundException("Category not found for this owner.");
        }
    }

    private async Task OpenConnectionAsync()
    {
        if (_connection.State != System.Data.ConnectionState.Open)
            await _connection.OpenAsync();
    }

    private static string SelectColumns(Definition definition) => $"""
        {definition.Id} AS id,
        {definition.Name} AS name,
        {Select(definition.Description, "description", "text")},
        {Select(definition.Contact, "contact", "text")},
        {Select(definition.Email, "email", "text")},
        {Select(definition.Address, "address", "text")},
        {Select(definition.CategoryId, "category_id", "integer")},
        {Select(definition.SellingPrice, "selling_price", "numeric")},
        {Select(definition.CostPrice, "cost_price", "numeric")},
        {Select(definition.TaxRate, "tax_rate", "numeric")},
        {Select(definition.TaxType, "tax_type", "text")},
        {Select(definition.Unit, "unit", "text")},
        {definition.Status} AS status
        """;

    private static string Select(string? column, string alias, string type) =>
        column == null ? $"NULL::{type} AS {alias}" : $"{column} AS {alias}";

    private static OwnerCatalogItem Map(NpgsqlDataReader reader) => new()
    {
        Id = reader.GetInt32(reader.GetOrdinal("id")),
        Name = reader.GetString(reader.GetOrdinal("name")),
        Description = ReadString(reader, "description"),
        Contact = ReadString(reader, "contact"),
        Email = ReadString(reader, "email"),
        Address = ReadString(reader, "address"),
        CategoryId = ReadInt(reader, "category_id"),
        SellingPrice = ReadDecimal(reader, "selling_price"),
        CostPrice = ReadDecimal(reader, "cost_price"),
        TaxRate = ReadDecimal(reader, "tax_rate"),
        TaxType = ReadString(reader, "tax_type"),
        Unit = ReadString(reader, "unit"),
        Status = reader.IsDBNull(reader.GetOrdinal("status")) ? "ACTIVE" : reader.GetString(reader.GetOrdinal("status"))
    };

    private static string? ReadString(NpgsqlDataReader reader, string name)
    {
        var ordinal = reader.GetOrdinal(name);
        return reader.IsDBNull(ordinal) ? null : reader.GetString(ordinal);
    }

    private static int? ReadInt(NpgsqlDataReader reader, string name)
    {
        var ordinal = reader.GetOrdinal(name);
        return reader.IsDBNull(ordinal) ? null : reader.GetInt32(ordinal);
    }

    private static decimal? ReadDecimal(NpgsqlDataReader reader, string name)
    {
        var ordinal = reader.GetOrdinal(name);
        return reader.IsDBNull(ordinal) ? null : reader.GetDecimal(ordinal);
    }

    private static (string Columns, string Values) GetWriteColumns(OwnerCatalogType type) => type switch
    {
        OwnerCatalogType.Category => ("c_category_name, c_description, c_status", "@name, @description, @status"),
        OwnerCatalogType.ExpenseCategory => ("c_expense_category_name, c_description, c_status", "@name, @description, @status"),
        OwnerCatalogType.Supplier => ("c_supplier_name, c_contact, c_email, c_address, c_status", "@name, @contact, @email, @address, @status"),
        OwnerCatalogType.Product => ("c_product_name, c_category_id, c_selling_price, c_cost_price, c_tax_rate, c_tax_type, c_unit, c_status", "@name, @category_id, @selling_price, @cost_price, @tax_rate, @tax_type, @unit, @status"),
        _ => throw new ArgumentOutOfRangeException(nameof(type))
    };

    private static string GetUpdateAssignments(OwnerCatalogType type) => type switch
    {
        OwnerCatalogType.Category => "c_category_name = @name, c_description = @description, c_status = @status",
        OwnerCatalogType.ExpenseCategory => "c_expense_category_name = @name, c_description = @description, c_status = @status",
        OwnerCatalogType.Supplier => "c_supplier_name = @name, c_contact = @contact, c_email = @email, c_address = @address, c_status = @status",
        OwnerCatalogType.Product => "c_product_name = @name, c_category_id = @category_id, c_selling_price = @selling_price, c_cost_price = @cost_price, c_tax_rate = @tax_rate, c_tax_type = @tax_type, c_unit = @unit, c_status = @status",
        _ => throw new ArgumentOutOfRangeException(nameof(type))
    };

    private static void AddWriteParameters(NpgsqlCommand command, OwnerCatalogType type, OwnerCatalogItem item, int userId)
    {
        command.Parameters.AddWithValue("@user_id", userId);
        command.Parameters.AddWithValue("@name", item.Name.Trim());
        command.Parameters.AddWithValue("@status", item.Status.Trim().ToUpperInvariant());

        if (type is OwnerCatalogType.Category or OwnerCatalogType.ExpenseCategory)
        {
            command.Parameters.AddWithValue("@description", (object?)item.Description?.Trim() ?? DBNull.Value);
        }
        else if (type == OwnerCatalogType.Supplier)
        {
            command.Parameters.AddWithValue("@contact", (object?)item.Contact?.Trim() ?? DBNull.Value);
            command.Parameters.AddWithValue("@email", (object?)item.Email?.Trim().ToLowerInvariant() ?? DBNull.Value);
            command.Parameters.AddWithValue("@address", (object?)item.Address?.Trim() ?? DBNull.Value);
        }
        else if (type == OwnerCatalogType.Product)
        {
            command.Parameters.AddWithValue("@category_id", (object?)item.CategoryId ?? DBNull.Value);
            command.Parameters.AddWithValue("@selling_price", item.SellingPrice!.Value);
            command.Parameters.AddWithValue("@cost_price", item.CostPrice!.Value);
            command.Parameters.AddWithValue("@tax_rate", item.TaxRate ?? 0m);
            command.Parameters.AddWithValue("@tax_type", item.TaxType ?? "exclusive");
            command.Parameters.AddWithValue("@unit", item.Unit!.Trim().ToUpperInvariant());
        }
    }

    private static Definition GetDefinition(OwnerCatalogType type) => type switch
    {
        OwnerCatalogType.Category => new("t_category", "c_category_id", "c_category_name", "c_description", null, null, null, null, null, null, null, null, null, "c_status"),
        OwnerCatalogType.ExpenseCategory => new("t_expense_category", "c_expense_category_id", "c_expense_category_name", "c_description", null, null, null, null, null, null, null, null, null, "c_status"),
        OwnerCatalogType.Supplier => new("t_supplier", "c_supplier_id", "c_supplier_name", null, "c_contact", "c_email", "c_address", null, null, null, null, null, null, "c_status"),
        OwnerCatalogType.Product => new("t_product", "c_product_id", "c_product_name", null, null, null, null, "c_category_id", "c_selling_price", "c_cost_price", "c_tax_rate", "c_tax_type", "c_unit", "c_status"),
        _ => throw new ArgumentOutOfRangeException(nameof(type))
    };

    private sealed record Definition(
        string Table, string Id, string Name, string? Description, string? Contact,
        string? Email, string? Address, string? CategoryId, string? SellingPrice,
        string? CostPrice, string? TaxRate, string? TaxType, string? Unit, string Status);
}
