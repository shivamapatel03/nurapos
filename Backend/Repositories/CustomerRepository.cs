using Npgsql;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;

namespace Nurapos.Repositories;

public sealed class CustomerRepository(NpgsqlConnection connection) : ICustomerRepository
{
    public async Task EnsureSchemaAsync()
    {
        const string sql = """
            CREATE TABLE IF NOT EXISTS t_customer (
                c_customer_id SERIAL PRIMARY KEY,
                c_user_id INT NOT NULL REFERENCES t_user(c_user_id) ON DELETE CASCADE,
                c_name VARCHAR(120) NOT NULL,
                c_phone VARCHAR(32) NOT NULL,
                c_email VARCHAR(100),
                c_address VARCHAR(500),
                c_loyalty_points INT NOT NULL DEFAULT 0 CHECK (c_loyalty_points >= 0),
                c_total_spent NUMERIC(14,2) NOT NULL DEFAULT 0,
                c_total_visits INT NOT NULL DEFAULT 0,
                c_created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                CONSTRAINT uq_customer_owner_phone UNIQUE (c_user_id, c_phone)
            );
            CREATE TABLE IF NOT EXISTS t_loyalty_ledger (
                c_ledger_id BIGSERIAL PRIMARY KEY,
                c_customer_id INT NOT NULL REFERENCES t_customer(c_customer_id) ON DELETE CASCADE,
                c_points_delta INT NOT NULL,
                c_discount_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
                c_created_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );
            CREATE INDEX IF NOT EXISTS ix_customer_owner_name ON t_customer(c_user_id, c_name);
            """;
        await OpenAsync();
        await using var cmd = new NpgsqlCommand(sql, connection);
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task<IReadOnlyList<Customer>> GetAllAsync(int ownerId, string? search, string? name)
    {
        const string sql = """
            SELECT c_customer_id, c_user_id, c_name, c_phone, c_email, c_address, c_loyalty_points,
                   c_total_spent, c_total_visits, c_created_at
            FROM t_customer WHERE c_user_id = @owner_id
              AND (@search IS NULL OR c_phone ILIKE '%' || @search || '%' OR c_name ILIKE '%' || @search || '%')
              AND (@name IS NULL OR c_name ILIKE '%' || @name || '%')
            ORDER BY c_name LIMIT 500;
            """;
        await OpenAsync();
        await using var cmd = new NpgsqlCommand(sql, connection);
        cmd.Parameters.AddWithValue("@owner_id", ownerId);
        cmd.Parameters.AddWithValue("@search", (object?)search ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@name", (object?)name ?? DBNull.Value);
        await using var reader = await cmd.ExecuteReaderAsync();
        var customers = new List<Customer>();
        while (await reader.ReadAsync()) customers.Add(Map(reader));
        return customers;
    }

    public async Task<Customer> CreateAsync(Customer customer)
    {
        const string sql = """
            INSERT INTO t_customer(c_user_id, c_name, c_phone, c_email, c_address)
            VALUES (@owner_id, @name, @phone, @email, @address)
            RETURNING c_customer_id, c_user_id, c_name, c_phone, c_email, c_address, c_loyalty_points,
                      c_total_spent, c_total_visits, c_created_at;
            """;
        await OpenAsync();
        await using var cmd = new NpgsqlCommand(sql, connection);
        cmd.Parameters.AddWithValue("@owner_id", customer.OwnerId);
        cmd.Parameters.AddWithValue("@name", customer.Name);
        cmd.Parameters.AddWithValue("@phone", customer.Phone);
        cmd.Parameters.AddWithValue("@email", (object?)customer.Email ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@address", (object?)customer.Address ?? DBNull.Value);
        await using var reader = await cmd.ExecuteReaderAsync();
        await reader.ReadAsync();
        return Map(reader);
    }

    public async Task<LoyaltyRedemption?> RedeemAsync(int ownerId, int customerId, int points, decimal saleSubtotal)
    {
        await OpenAsync();
        await using var transaction = await connection.BeginTransactionAsync();
        const string update = """
            UPDATE t_customer SET c_loyalty_points = c_loyalty_points - @points
            WHERE c_customer_id = @customer_id AND c_user_id = @owner_id AND c_loyalty_points >= @points
            RETURNING c_loyalty_points;
            """;
        await using var updateCmd = new NpgsqlCommand(update, connection, transaction);
        updateCmd.Parameters.AddWithValue("@customer_id", customerId);
        updateCmd.Parameters.AddWithValue("@owner_id", ownerId);
        updateCmd.Parameters.AddWithValue("@points", points);
        var value = await updateCmd.ExecuteScalarAsync();
        if (value is null) { await transaction.RollbackAsync(); return null; }
        var discount = Math.Min(points, saleSubtotal);
        await using var ledgerCmd = new NpgsqlCommand("INSERT INTO t_loyalty_ledger(c_customer_id, c_points_delta, c_discount_amount) VALUES (@id, @delta, @discount);", connection, transaction);
        ledgerCmd.Parameters.AddWithValue("@id", customerId);
        ledgerCmd.Parameters.AddWithValue("@delta", -points);
        ledgerCmd.Parameters.AddWithValue("@discount", discount);
        await ledgerCmd.ExecuteNonQueryAsync();
        await transaction.CommitAsync();
        return new LoyaltyRedemption(discount, Convert.ToInt32(value));
    }

    private async Task OpenAsync() { if (connection.State != System.Data.ConnectionState.Open) await connection.OpenAsync(); }
    private static Customer Map(NpgsqlDataReader r) => new()
    {
        Id = r.GetInt32(0), OwnerId = r.GetInt32(1), Name = r.GetString(2), Phone = r.GetString(3),
        Email = r.IsDBNull(4) ? null : r.GetString(4), Address = r.IsDBNull(5) ? null : r.GetString(5),
        LoyaltyPoints = r.GetInt32(6), TotalSpent = r.GetDecimal(7), TotalVisits = r.GetInt32(8), CreatedAtUtc = r.GetDateTime(9)
    };
}
