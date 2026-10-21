using Npgsql;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;

namespace Nurapos.Repositories;

public sealed class TerminalRepository(NpgsqlConnection connection) : ITerminalRepository
{
    public async Task EnsureSchemaAsync()
    {
        const string sql = """
            CREATE TABLE IF NOT EXISTS t_terminal (
                c_terminal_id SERIAL PRIMARY KEY,
                c_user_id INT NOT NULL REFERENCES t_user(c_user_id) ON DELETE CASCADE,
                c_franchise_id INT NOT NULL REFERENCES t_franchise(c_franchise_id) ON DELETE CASCADE,
                c_terminal_code VARCHAR(32) NOT NULL,
                c_device_name VARCHAR(100) NOT NULL,
                c_platform VARCHAR(80),
                c_hardware_identifier VARCHAR(200),
                c_last_heartbeat TIMESTAMPTZ,
                c_app_version VARCHAR(40),
                c_battery_percent NUMERIC(5,2),
                c_peripheral_status TEXT,
                c_created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                CONSTRAINT uq_terminal_owner_code UNIQUE (c_user_id, c_terminal_code)
            );
            ALTER TABLE t_terminal ADD COLUMN IF NOT EXISTS c_user_id INT REFERENCES t_user(c_user_id) ON DELETE CASCADE;
            UPDATE t_terminal t SET c_user_id=f.c_user_id FROM t_franchise f WHERE f.c_franchise_id=t.c_franchise_id AND t.c_user_id IS NULL;
            ALTER TABLE t_terminal ALTER COLUMN c_user_id SET NOT NULL;
            CREATE UNIQUE INDEX IF NOT EXISTS uq_terminal_owner_code_ci ON t_terminal(c_user_id, upper(c_terminal_code));
            CREATE INDEX IF NOT EXISTS ix_terminal_franchise_id ON t_terminal(c_franchise_id);
            """;
        await OpenAsync();
        await using var cmd = new NpgsqlCommand(sql, connection);
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task<PosTerminal> RegisterAsync(PosTerminal terminal, int ownerId)
    {
        const string sql = """
            INSERT INTO t_terminal (c_user_id,c_franchise_id, c_terminal_code, c_device_name, c_platform, c_hardware_identifier)
            SELECT @owner_id,@franchise_id, @code, @name, @platform, @hardware
            WHERE EXISTS (SELECT 1 FROM t_franchise WHERE c_franchise_id = @franchise_id AND c_user_id = @owner_id)
            RETURNING c_terminal_id;
            """;
        await OpenAsync();
        await using var cmd = new NpgsqlCommand(sql, connection);
        cmd.Parameters.AddWithValue("@franchise_id", terminal.FranchiseId);
        cmd.Parameters.AddWithValue("@code", terminal.TerminalCode);
        cmd.Parameters.AddWithValue("@name", terminal.DeviceName);
        cmd.Parameters.AddWithValue("@platform", (object?)terminal.Platform ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@hardware", (object?)terminal.HardwareIdentifier ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@owner_id", ownerId);
        var value = await cmd.ExecuteScalarAsync();
        if (value is null) throw new KeyNotFoundException("Franchise not found.");
        terminal.Id = Convert.ToInt32(value);
        terminal.OwnerId = ownerId;
        return terminal;
    }

    public async Task<bool> HeartbeatAsync(string terminalCode, TerminalHeartbeatData heartbeat, int ownerId)
    {
        const string sql = """
            UPDATE t_terminal SET c_last_heartbeat = now(), c_app_version = @version,
                c_battery_percent = @battery, c_peripheral_status = @status
            WHERE c_terminal_code = @code AND c_user_id=@owner_id AND EXISTS (
                SELECT 1 FROM t_franchise f WHERE f.c_franchise_id = t_terminal.c_franchise_id AND f.c_user_id = @owner_id);
            """;
        await OpenAsync();
        await using var cmd = new NpgsqlCommand(sql, connection);
        cmd.Parameters.AddWithValue("@code", terminalCode);
        cmd.Parameters.AddWithValue("@owner_id", ownerId);
        cmd.Parameters.AddWithValue("@version", (object?)heartbeat.AppVersion ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@battery", (object?)heartbeat.BatteryPercent ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@status", (object?)heartbeat.PeripheralStatus ?? DBNull.Value);
        return await cmd.ExecuteNonQueryAsync() == 1;
    }

    public async Task<IReadOnlyList<Employee>> GetEligibleEmployeesAsync(string terminalCode, int ownerId)
    {
        const string sql = """
            SELECT e.c_employee_id, e.c_franchise_id, e.c_employee_code, e.c_name, e.c_role, e.c_phone, e.c_email,
                   e.c_is_active, e.c_pin_hash IS NOT NULL, e.c_created_at
            FROM t_employee e JOIN t_terminal t ON t.c_franchise_id = e.c_franchise_id
            JOIN t_franchise f ON f.c_franchise_id = t.c_franchise_id
            WHERE t.c_terminal_code = @code AND f.c_user_id = @owner_id AND e.c_is_active = TRUE ORDER BY e.c_name;
            """;
        await OpenAsync();
        await using var cmd = new NpgsqlCommand(sql, connection);
        cmd.Parameters.AddWithValue("@code", terminalCode);
        cmd.Parameters.AddWithValue("@owner_id", ownerId);
        await using var reader = await cmd.ExecuteReaderAsync();
        var result = new List<Employee>();
        while (await reader.ReadAsync())
        {
            result.Add(new Employee
            {
                Id = reader.GetInt32(0), FranchiseId = reader.GetInt32(1), EmployeeCode = reader.GetString(2),
                Name = reader.GetString(3), Role = reader.GetString(4), Phone = reader.IsDBNull(5) ? null : reader.GetString(5),
                Email = reader.IsDBNull(6) ? null : reader.GetString(6), IsActive = reader.GetBoolean(7),
                PinConfigured = reader.GetBoolean(8), CreatedAtUtc = reader.GetDateTime(9)
            });
        }
        return result;
    }

    public async Task<PosEmployeeAuth?> GetEmployeePinAsync(string terminalCode, int employeeId)
    {
        const string sql = """
            SELECT f.c_user_id,e.c_franchise_id,t.c_terminal_code,e.c_employee_id,e.c_employee_code,e.c_name,e.c_role,e.c_phone,e.c_email,
                   e.c_is_active,e.c_pin_hash,e.c_created_at
            FROM t_employee e JOIN t_terminal t ON t.c_franchise_id = e.c_franchise_id
            JOIN t_franchise f ON f.c_franchise_id=t.c_franchise_id
            WHERE t.c_terminal_code = @terminal AND e.c_employee_id = @employee AND e.c_is_active = TRUE;
            """;
        await OpenAsync();
        await using var cmd = new NpgsqlCommand(sql, connection);
        cmd.Parameters.AddWithValue("@terminal", terminalCode);
        cmd.Parameters.AddWithValue("@employee", employeeId);
        await using var reader = await cmd.ExecuteReaderAsync();
        if (!await reader.ReadAsync()) return null;
        var pinHash = reader.IsDBNull(10) ? null : reader.GetString(10);
        var employee = new Employee
        {
            Id = reader.GetInt32(3), FranchiseId = reader.GetInt32(1), EmployeeCode = reader.GetString(4),
            Name = reader.GetString(5), Role = reader.GetString(6), Phone = reader.IsDBNull(7) ? null : reader.GetString(7),
            Email = reader.IsDBNull(8) ? null : reader.GetString(8), IsActive = reader.GetBoolean(9),
            PinConfigured = pinHash is not null, CreatedAtUtc = reader.GetDateTime(11)
        };
        return new PosEmployeeAuth(employee,pinHash,reader.GetInt32(0),reader.GetInt32(1),reader.GetString(2));
    }

    private async Task OpenAsync() { if (connection.State != System.Data.ConnectionState.Open) await connection.OpenAsync(); }
}
