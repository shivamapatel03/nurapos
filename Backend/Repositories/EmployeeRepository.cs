using Npgsql;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;

namespace Nurapos.Repositories;

public sealed class EmployeeRepository(NpgsqlConnection connection) : IEmployeeRepository
{
    public async Task EnsureSchemaAsync()
    {
        const string sql = """
            CREATE TABLE IF NOT EXISTS t_employee (
                c_employee_id SERIAL PRIMARY KEY,
                c_franchise_id INT NOT NULL REFERENCES t_franchise(c_franchise_id) ON DELETE CASCADE,
                c_employee_code VARCHAR(32) NOT NULL,
                c_name VARCHAR(120) NOT NULL,
                c_role VARCHAR(40) NOT NULL,
                c_phone VARCHAR(32),
                c_email VARCHAR(100),
                c_pin_hash TEXT,
                c_is_active BOOLEAN NOT NULL DEFAULT TRUE,
                c_created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                CONSTRAINT uq_employee_franchise_code UNIQUE (c_franchise_id, c_employee_code)
            );
            CREATE INDEX IF NOT EXISTS ix_employee_franchise_active ON t_employee(c_franchise_id, c_is_active);
            CREATE UNIQUE INDEX IF NOT EXISTS uq_employee_franchise_code_ci ON t_employee(c_franchise_id, upper(c_employee_code));
            """;
        await OpenAsync();
        await using var cmd = new NpgsqlCommand(sql, connection);
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task<IReadOnlyList<Employee>> GetAllAsync(int ownerId, int? franchiseId)
    {
        const string sql = """
            SELECT e.c_employee_id, e.c_franchise_id, e.c_employee_code, e.c_name, e.c_role, e.c_phone, e.c_email,
                   e.c_is_active, e.c_pin_hash IS NOT NULL AS c_pin_configured, e.c_created_at
            FROM t_employee e JOIN t_franchise f ON f.c_franchise_id = e.c_franchise_id
            WHERE f.c_user_id = @owner_id AND (@franchise_id IS NULL OR f.c_franchise_id = @franchise_id)
            ORDER BY e.c_employee_id;
            """;
        await OpenAsync();
        await using var cmd = new NpgsqlCommand(sql, connection);
        cmd.Parameters.AddWithValue("@owner_id", ownerId);
        cmd.Parameters.AddWithValue("@franchise_id", (object?)franchiseId ?? DBNull.Value);
        await using var reader = await cmd.ExecuteReaderAsync();
        var items = new List<Employee>();
        while (await reader.ReadAsync()) items.Add(Map(reader));
        return items;
    }

    public async Task<Employee?> GetAsync(int ownerId, int employeeId)
    {
        const string sql = """
            SELECT e.c_employee_id, e.c_franchise_id, e.c_employee_code, e.c_name, e.c_role, e.c_phone, e.c_email,
                   e.c_is_active, e.c_pin_hash IS NOT NULL AS c_pin_configured, e.c_created_at
            FROM t_employee e JOIN t_franchise f ON f.c_franchise_id = e.c_franchise_id
            WHERE f.c_user_id = @owner_id AND e.c_employee_id = @id;
            """;
        await OpenAsync();
        await using var cmd = new NpgsqlCommand(sql, connection);
        cmd.Parameters.AddWithValue("@owner_id", ownerId);
        cmd.Parameters.AddWithValue("@id", employeeId);
        await using var reader = await cmd.ExecuteReaderAsync();
        return await reader.ReadAsync() ? Map(reader) : null;
    }

    public async Task<Employee> CreateAsync(Employee employee, string? pinHash, int ownerId)
    {
        const string sql = """
            INSERT INTO t_employee (c_franchise_id, c_employee_code, c_name, c_role, c_phone, c_email, c_pin_hash)
            SELECT @franchise_id, @code, @name, @role, @phone, @email, @pin_hash
            WHERE EXISTS (SELECT 1 FROM t_franchise WHERE c_franchise_id = @franchise_id AND c_user_id = @owner_id)
            RETURNING c_employee_id;
            """;
        await OpenAsync();
        await using var cmd = new NpgsqlCommand(sql, connection);
        cmd.Parameters.AddWithValue("@franchise_id", employee.FranchiseId);
        cmd.Parameters.AddWithValue("@code", employee.EmployeeCode);
        cmd.Parameters.AddWithValue("@name", employee.Name);
        cmd.Parameters.AddWithValue("@role", employee.Role);
        cmd.Parameters.AddWithValue("@phone", (object?)employee.Phone ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@email", (object?)employee.Email ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@pin_hash", (object?)pinHash ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@owner_id", ownerId);
        var id = await cmd.ExecuteScalarAsync();
        if (id is null) throw new KeyNotFoundException("Franchise not found.");
        employee.Id = Convert.ToInt32(id);
        employee.PinConfigured = pinHash is not null;
        employee.CreatedAtUtc = DateTime.UtcNow;
        return employee;
    }

    public async Task<bool> UpdateAsync(Employee employee, int ownerId)
    {
        const string sql = """
            UPDATE t_employee e SET c_name = @name, c_role = @role, c_phone = @phone, c_email = @email, c_is_active = @active
            FROM t_franchise f WHERE e.c_franchise_id = f.c_franchise_id AND f.c_user_id = @owner_id AND e.c_employee_id = @id;
            """;
        await OpenAsync();
        await using var cmd = new NpgsqlCommand(sql, connection);
        cmd.Parameters.AddWithValue("@id", employee.Id);
        cmd.Parameters.AddWithValue("@owner_id", ownerId);
        cmd.Parameters.AddWithValue("@name", employee.Name);
        cmd.Parameters.AddWithValue("@role", employee.Role);
        cmd.Parameters.AddWithValue("@phone", (object?)employee.Phone ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@email", (object?)employee.Email ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@active", employee.IsActive);
        return await cmd.ExecuteNonQueryAsync() == 1;
    }

    public async Task<bool> DeactivateAsync(int employeeId, int ownerId)
    {
        const string sql = """
            UPDATE t_employee e SET c_is_active = FALSE FROM t_franchise f
            WHERE e.c_franchise_id = f.c_franchise_id AND f.c_user_id = @owner_id AND e.c_employee_id = @id;
            """;
        await OpenAsync();
        await using var cmd = new NpgsqlCommand(sql, connection);
        cmd.Parameters.AddWithValue("@owner_id", ownerId);
        cmd.Parameters.AddWithValue("@id", employeeId);
        return await cmd.ExecuteNonQueryAsync() == 1;
    }

    public async Task<bool> SetPinAsync(int employeeId, int ownerId, string pinHash)
    {
        const string sql = """
            UPDATE t_employee e SET c_pin_hash = @pin_hash FROM t_franchise f
            WHERE e.c_franchise_id = f.c_franchise_id AND f.c_user_id = @owner_id AND e.c_employee_id = @id;
            """;
        await OpenAsync();
        await using var cmd = new NpgsqlCommand(sql, connection);
        cmd.Parameters.AddWithValue("@pin_hash", pinHash);
        cmd.Parameters.AddWithValue("@owner_id", ownerId);
        cmd.Parameters.AddWithValue("@id", employeeId);
        return await cmd.ExecuteNonQueryAsync() == 1;
    }

    private async Task OpenAsync() { if (connection.State != System.Data.ConnectionState.Open) await connection.OpenAsync(); }
    private static Employee Map(NpgsqlDataReader r) => new()
    {
        Id = r.GetInt32(0), FranchiseId = r.GetInt32(1), EmployeeCode = r.GetString(2), Name = r.GetString(3),
        Role = r.GetString(4), Phone = r.IsDBNull(5) ? null : r.GetString(5), Email = r.IsDBNull(6) ? null : r.GetString(6),
        IsActive = r.GetBoolean(7), PinConfigured = r.GetBoolean(8), CreatedAtUtc = r.GetDateTime(9)
    };
}
