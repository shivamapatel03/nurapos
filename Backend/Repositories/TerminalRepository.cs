using Npgsql;
using Nurapos.DTOs.Terminals;
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
            INSERT INTO t_terminal (c_user_id, c_franchise_id, c_terminal_code, c_device_name, c_platform, c_hardware_identifier)
            SELECT @owner_id, @franchise_id, @code, @name, @platform, @hardware
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
            WHERE c_terminal_code = @code AND c_user_id = @owner_id AND EXISTS (
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
                Id = reader.GetInt32(0),
                FranchiseId = reader.GetInt32(1),
                EmployeeCode = reader.GetString(2),
                Name = reader.GetString(3),
                Role = reader.GetString(4),
                Phone = reader.IsDBNull(5) ? null : reader.GetString(5),
                Email = reader.IsDBNull(6) ? null : reader.GetString(6),
                IsActive = reader.GetBoolean(7),
                PinConfigured = reader.GetBoolean(8),
                CreatedAtUtc = reader.GetDateTime(9)
            });
        }
        return result;
    }

    public async Task<PosEmployeeAuth?> GetEmployeePinAsync(string terminalCode, int employeeId)
    {
        await OpenAsync();

        // 1. Fetch employee details and associated franchise/owner
        const string empSql = """
            SELECT f.c_user_id, e.c_franchise_id, e.c_employee_id, e.c_employee_code, e.c_name, e.c_role, e.c_phone, e.c_email,
                   e.c_is_active, e.c_pin_hash, e.c_created_at
            FROM t_employee e
            JOIN t_franchise f ON f.c_franchise_id = e.c_franchise_id
            WHERE e.c_employee_id = @employee AND e.c_is_active = TRUE;
            """;
        await using var cmd = new NpgsqlCommand(empSql, connection);
        cmd.Parameters.AddWithValue("@employee", employeeId);
        await using var reader = await cmd.ExecuteReaderAsync();
        if (!await reader.ReadAsync()) return null;

        var ownerId = reader.GetInt32(0);
        var franchiseId = reader.GetInt32(1);
        var empId = reader.GetInt32(2);
        var code = reader.GetString(3);
        var name = reader.GetString(4);
        var role = reader.GetString(5);
        var phone = reader.IsDBNull(6) ? null : reader.GetString(6);
        var email = reader.IsDBNull(7) ? null : reader.GetString(7);
        var isActive = reader.GetBoolean(8);
        var pinHash = reader.IsDBNull(9) ? null : reader.GetString(9);
        var createdAt = reader.GetDateTime(10);
        await reader.CloseAsync();

        // 2. Ensure terminal exists in t_terminal so shift operations succeed
        const string termSql = """
            INSERT INTO t_terminal (c_user_id, c_franchise_id, c_terminal_code, c_device_name)
            VALUES (@owner_id, @franchise_id, @terminal, 'Active POS Terminal')
            ON CONFLICT (c_user_id, c_terminal_code) DO NOTHING;
            """;
        await using var termCmd = new NpgsqlCommand(termSql, connection);
        termCmd.Parameters.AddWithValue("@owner_id", ownerId);
        termCmd.Parameters.AddWithValue("@franchise_id", franchiseId);
        termCmd.Parameters.AddWithValue("@terminal", terminalCode);
        await termCmd.ExecuteNonQueryAsync();

        var employee = new Employee
        {
            Id = empId,
            FranchiseId = franchiseId,
            EmployeeCode = code,
            Name = name,
            Role = role,
            Phone = phone,
            Email = email,
            IsActive = isActive,
            PinConfigured = pinHash is not null,
            CreatedAtUtc = createdAt
        };
        return new PosEmployeeAuth(employee, pinHash, ownerId, franchiseId, terminalCode);
    }

    public async Task<EmployeeLookupDto?> LookupEmployeeAsync(string identifier)
    {
        await OpenAsync();
        var trimmed = identifier.Trim();

        // 1. Check t_employee by employee code, email, or numeric ID
        const string empSql = """
            SELECT e.c_employee_id, e.c_franchise_id, f.c_name AS c_franchise_name, e.c_employee_code, e.c_name, e.c_role, e.c_phone, e.c_email,
                   e.c_pin_hash IS NOT NULL AS c_pin_configured
            FROM t_employee e
            JOIN t_franchise f ON f.c_franchise_id = e.c_franchise_id
            WHERE e.c_is_active = TRUE
              AND (
                   UPPER(e.c_employee_code) = UPPER(@identifier)
                OR LOWER(e.c_email) = LOWER(@identifier)
                OR e.c_employee_id::text = @identifier
              )
            LIMIT 1;
            """;
        await using (var cmd = new NpgsqlCommand(empSql, connection))
        {
            cmd.Parameters.AddWithValue("@identifier", trimmed);
            await using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new EmployeeLookupDto
                {
                    Id = reader.GetInt32(0),
                    FranchiseId = reader.GetInt32(1),
                    FranchiseName = reader.GetString(2),
                    EmployeeCode = reader.GetString(3),
                    Name = reader.GetString(4),
                    Role = reader.GetString(5),
                    Phone = reader.IsDBNull(6) ? null : reader.GetString(6),
                    Email = reader.IsDBNull(7) ? null : reader.GetString(7),
                    PinConfigured = reader.GetBoolean(8)
                };
            }
        }

        // 2. Check t_user for Franchise Owner login
        const string userSql = """
            SELECT u.c_user_id, COALESCE(f.c_franchise_id, 1), COALESCE(f.c_name, 'Main Flagship'),
                   'OWNER' AS c_code, u.c_name, 'Franchise Owner' AS c_role, u.c_phone, u.c_email,
                   TRUE AS c_pin_configured
            FROM t_user u
            LEFT JOIN t_franchise f ON f.c_user_id = u.c_user_id
            WHERE LOWER(u.c_email) = LOWER(@identifier) OR LOWER(@identifier) IN ('owner', 'admin')
            LIMIT 1;
            """;
        await using (var userCmd = new NpgsqlCommand(userSql, connection))
        {
            userCmd.Parameters.AddWithValue("@identifier", trimmed);
            await using var userReader = await userCmd.ExecuteReaderAsync();
            if (await userReader.ReadAsync())
            {
                return new EmployeeLookupDto
                {
                    Id = userReader.GetInt32(0),
                    FranchiseId = userReader.GetInt32(1),
                    FranchiseName = userReader.GetString(2),
                    EmployeeCode = userReader.GetString(3),
                    Name = userReader.GetString(4),
                    Role = userReader.GetString(5),
                    Phone = userReader.IsDBNull(6) ? null : userReader.GetString(6),
                    Email = userReader.IsDBNull(7) ? null : userReader.GetString(7),
                    PinConfigured = userReader.GetBoolean(8)
                };
            }
        }

        return null;
    }

    private async Task OpenAsync()
    {
        if (connection.State != System.Data.ConnectionState.Open)
            await connection.OpenAsync();
    }
}
