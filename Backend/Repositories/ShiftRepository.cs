using Npgsql;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;

namespace Nurapos.Repositories;

public sealed class ShiftRepository(NpgsqlConnection connection) : IShiftRepository
{
    public async Task EnsureSchemaAsync()
    {
        const string sql = """
            CREATE TABLE IF NOT EXISTS t_register_shift (
                c_shift_id VARCHAR(40) PRIMARY KEY,
                c_user_id INT NOT NULL REFERENCES t_user(c_user_id) ON DELETE CASCADE,
                c_franchise_id INT NOT NULL REFERENCES t_franchise(c_franchise_id) ON DELETE CASCADE,
                c_terminal_code VARCHAR(32) NOT NULL,
                c_cashier_id INT NOT NULL REFERENCES t_employee(c_employee_id),
                c_opened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                c_closed_at TIMESTAMPTZ,
                c_status VARCHAR(12) NOT NULL DEFAULT 'OPEN' CHECK (c_status IN ('OPEN','CLOSED')),
                c_opening_float NUMERIC(14,2) NOT NULL,
                c_total_sales NUMERIC(14,2) NOT NULL DEFAULT 0,
                c_cash_sales NUMERIC(14,2) NOT NULL DEFAULT 0,
                c_card_sales NUMERIC(14,2) NOT NULL DEFAULT 0,
                c_upi_sales NUMERIC(14,2) NOT NULL DEFAULT 0,
                c_z_report_generated BOOLEAN NOT NULL DEFAULT FALSE,
                c_expected_cash NUMERIC(14,2),
                c_actual_cash NUMERIC(14,2),
                c_cash_difference NUMERIC(14,2),
                c_notes TEXT
            );
            ALTER TABLE t_register_shift ADD COLUMN IF NOT EXISTS c_total_sales NUMERIC(14,2) NOT NULL DEFAULT 0;
            ALTER TABLE t_register_shift ADD COLUMN IF NOT EXISTS c_card_sales NUMERIC(14,2) NOT NULL DEFAULT 0;
            ALTER TABLE t_register_shift ADD COLUMN IF NOT EXISTS c_upi_sales NUMERIC(14,2) NOT NULL DEFAULT 0;
            ALTER TABLE t_register_shift ADD COLUMN IF NOT EXISTS c_z_report_generated BOOLEAN NOT NULL DEFAULT FALSE;
            CREATE UNIQUE INDEX IF NOT EXISTS uq_open_shift_terminal ON t_register_shift(c_franchise_id, c_terminal_code) WHERE c_status = 'OPEN';
            CREATE TABLE IF NOT EXISTS t_shift_cash_movement (
                c_movement_id BIGSERIAL PRIMARY KEY,
                c_shift_id VARCHAR(40) NOT NULL REFERENCES t_register_shift(c_shift_id) ON DELETE CASCADE,
                c_type VARCHAR(8) NOT NULL CHECK (c_type IN ('PAY_IN','PAY_OUT')),
                c_amount NUMERIC(14,2) NOT NULL CHECK (c_amount > 0),
                c_reason VARCHAR(500) NOT NULL,
                c_created_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );
            """;
        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, connection);
        await command.ExecuteNonQueryAsync();
    }

    public async Task<RegisterShift> OpenAsync(RegisterShift shift, int ownerId)
    {
        shift.ShiftId = $"SH-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid():N}"[..28];
        const string sql = """
            INSERT INTO t_register_shift(c_shift_id,c_user_id,c_franchise_id,c_terminal_code,c_cashier_id,c_opening_float,c_notes)
            SELECT @id,@owner,@franchise,@terminal,@cashier,@float,@notes
            WHERE EXISTS (SELECT 1 FROM t_franchise f WHERE f.c_franchise_id=@franchise AND f.c_user_id=@owner)
              AND EXISTS (SELECT 1 FROM t_terminal t JOIN t_employee e ON e.c_franchise_id=t.c_franchise_id
                          WHERE t.c_terminal_code=@terminal AND t.c_franchise_id=@franchise AND e.c_employee_id=@cashier AND e.c_is_active)
            RETURNING c_opened_at;
            """;
        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, connection);
        command.Parameters.AddWithValue("@id", shift.ShiftId);
        command.Parameters.AddWithValue("@owner", ownerId);
        command.Parameters.AddWithValue("@franchise", shift.FranchiseId);
        command.Parameters.AddWithValue("@terminal", shift.TerminalId);
        command.Parameters.AddWithValue("@cashier", shift.CashierId);
        command.Parameters.AddWithValue("@float", shift.OpeningFloat);
        command.Parameters.AddWithValue("@notes", (object?)shift.Notes ?? DBNull.Value);
        var result = await command.ExecuteScalarAsync();
        if (result is null) throw new KeyNotFoundException("Terminal, employee, or franchise not found in your account.");
        shift.OpenedAtUtc = (DateTime)result;
        return shift;
    }

    public async Task<RegisterShift?> GetActiveAsync(int ownerId, string terminalId, int? cashierId)
    {
        const string sql = """
            SELECT c_shift_id,c_franchise_id,c_terminal_code,c_cashier_id,c_opened_at,c_closed_at,c_status,c_opening_float,c_expected_cash,c_actual_cash,c_cash_difference,c_notes,
                   c_total_sales,c_cash_sales,c_card_sales,c_upi_sales
            FROM t_register_shift WHERE c_user_id=@owner AND c_status='OPEN'
              AND (@terminal IS NULL OR c_terminal_code=@terminal) AND (@cashier IS NULL OR c_cashier_id=@cashier)
            ORDER BY c_opened_at DESC LIMIT 1;
            """;
        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, connection);
        command.Parameters.AddWithValue("@owner", ownerId);
        command.Parameters.AddWithValue("@terminal", (object?)terminalId ?? DBNull.Value);
        command.Parameters.AddWithValue("@cashier", (object?)cashierId ?? DBNull.Value);
        await using var reader = await command.ExecuteReaderAsync();
        return await reader.ReadAsync() ? Map(reader) : null;
    }

    public async Task<bool> AddCashMovementAsync(int ownerId, string shiftId, string type, decimal amount, string reason, int? employeeId, string? terminalId)
    {
        const string sql = """
            INSERT INTO t_shift_cash_movement(c_shift_id,c_type,c_amount,c_reason)
            SELECT c_shift_id,@type,@amount,@reason FROM t_register_shift
            WHERE c_shift_id=@shift AND c_user_id=@owner AND c_status='OPEN'
              AND (@employee IS NULL OR c_cashier_id=@employee) AND (@terminal IS NULL OR c_terminal_code=@terminal)
            FOR UPDATE;
            """;
        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, connection);
        command.Parameters.AddWithValue("@type", type);
        command.Parameters.AddWithValue("@amount", amount);
        command.Parameters.AddWithValue("@reason", reason);
        command.Parameters.AddWithValue("@shift", shiftId);
        command.Parameters.AddWithValue("@owner", ownerId);
        command.Parameters.AddWithValue("@employee", (object?)employeeId ?? DBNull.Value);
        command.Parameters.AddWithValue("@terminal", (object?)terminalId ?? DBNull.Value);
        return await command.ExecuteNonQueryAsync() == 1;
    }

    public async Task<ShiftCloseRecord?> CloseAsync(int ownerId, string shiftId, decimal actualCash, string? notes, int? employeeId, string? terminalId)
    {
        const string sql = """
            WITH target AS MATERIALIZED (
                SELECT s.c_shift_id,s.c_opening_float,s.c_cash_sales
                FROM t_register_shift s WHERE s.c_shift_id=@shift AND s.c_user_id=@owner AND s.c_status='OPEN'
                  AND (@employee IS NULL OR s.c_cashier_id=@employee) AND (@terminal IS NULL OR s.c_terminal_code=@terminal)
                FOR UPDATE
            ), movement AS MATERIALIZED (
                SELECT COALESCE(SUM(CASE WHEN m.c_type='PAY_IN' THEN m.c_amount ELSE -m.c_amount END),0) AS amount
                FROM t_shift_cash_movement m WHERE m.c_shift_id=@shift AND EXISTS(SELECT 1 FROM target)
            ), closed AS (
                UPDATE t_register_shift s SET c_expected_cash=s.c_opening_float+s.c_cash_sales+movement.amount,
                    c_actual_cash=@actual,
                    c_cash_difference=@actual-(s.c_opening_float+s.c_cash_sales+movement.amount),
                c_notes=COALESCE(@notes,s.c_notes),c_status='CLOSED',c_closed_at=now(),c_z_report_generated=TRUE
                FROM target,movement WHERE s.c_shift_id=target.c_shift_id
                RETURNING s.c_shift_id,s.c_expected_cash,s.c_actual_cash,s.c_cash_difference,s.c_total_sales,s.c_cash_sales,s.c_card_sales,s.c_upi_sales
            ) SELECT * FROM closed;
            """;
        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, connection);
        command.Parameters.AddWithValue("@shift", shiftId);
        command.Parameters.AddWithValue("@owner", ownerId);
        command.Parameters.AddWithValue("@actual", actualCash);
        command.Parameters.AddWithValue("@notes", (object?)notes ?? DBNull.Value);
        command.Parameters.AddWithValue("@employee", (object?)employeeId ?? DBNull.Value);
        command.Parameters.AddWithValue("@terminal", (object?)terminalId ?? DBNull.Value);
        await using var reader = await command.ExecuteReaderAsync();
        if (!await reader.ReadAsync()) return null;
        return new ShiftCloseRecord(reader.GetString(0), reader.GetDecimal(1), reader.GetDecimal(2), reader.GetDecimal(3),reader.GetDecimal(4),reader.GetDecimal(5),reader.GetDecimal(6),reader.GetDecimal(7));
    }

    private async Task OpenConnectionAsync() { if (connection.State != System.Data.ConnectionState.Open) await connection.OpenAsync(); }
    private static RegisterShift Map(NpgsqlDataReader r) => new()
    {
        ShiftId=r.GetString(0),FranchiseId=r.GetInt32(1),TerminalId=r.GetString(2),CashierId=r.GetInt32(3),OpenedAtUtc=r.GetDateTime(4),
        ClosedAtUtc=r.IsDBNull(5)?null:r.GetDateTime(5),Status=r.GetString(6),OpeningFloat=r.GetDecimal(7),
        ExpectedCash=r.IsDBNull(8)?null:r.GetDecimal(8),ActualCash=r.IsDBNull(9)?null:r.GetDecimal(9),CashDifference=r.IsDBNull(10)?null:r.GetDecimal(10),
        Notes=r.IsDBNull(11)?null:r.GetString(11),TotalSales=r.GetDecimal(12),CashSales=r.GetDecimal(13),CardTotal=r.GetDecimal(14),UpiTotal=r.GetDecimal(15)
    };
}
