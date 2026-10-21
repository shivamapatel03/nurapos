using Npgsql;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;

namespace Nurapos.Repositories;

public sealed class TableRepository(NpgsqlConnection connection) : ITableRepository
{
    public async Task EnsureSchemaAsync()
    {
        const string sql = """
            CREATE TABLE IF NOT EXISTS t_dining_table (
                c_table_id SERIAL PRIMARY KEY,
                c_franchise_id INT NOT NULL REFERENCES t_franchise(c_franchise_id) ON DELETE CASCADE,
                c_table_number VARCHAR(24) NOT NULL,
                c_section VARCHAR(80) NOT NULL,
                c_capacity INT NOT NULL CHECK (c_capacity > 0),
                c_status VARCHAR(12) NOT NULL DEFAULT 'VACANT' CHECK (c_status IN ('VACANT','OCCUPIED','RESERVED','BILLED')),
                c_active_order_id VARCHAR(64),
                CONSTRAINT uq_dining_table_franchise_number UNIQUE (c_franchise_id,c_table_number)
            );
            """;
        await OpenAsync();
        await using var cmd = new NpgsqlCommand(sql, connection);
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task<IReadOnlyList<DiningTable>> GetAllAsync(int ownerId, int franchiseId)
    {
        const string sql = """
            SELECT t.c_table_id,t.c_franchise_id,t.c_table_number,t.c_section,t.c_capacity,t.c_status,t.c_active_order_id
            FROM t_dining_table t JOIN t_franchise f ON f.c_franchise_id=t.c_franchise_id
            WHERE f.c_user_id=@owner AND t.c_franchise_id=@franchise ORDER BY t.c_section,t.c_table_number;
            """;
        await OpenAsync();
        await using var cmd = new NpgsqlCommand(sql, connection);
        cmd.Parameters.AddWithValue("@owner", ownerId);
        cmd.Parameters.AddWithValue("@franchise", franchiseId);
        await using var reader = await cmd.ExecuteReaderAsync();
        var tables = new List<DiningTable>();
        while (await reader.ReadAsync()) tables.Add(Map(reader));
        return tables;
    }

    public async Task<DiningTable> CreateAsync(DiningTable table, int ownerId)
    {
        const string sql = """
            INSERT INTO t_dining_table(c_franchise_id,c_table_number,c_section,c_capacity)
            SELECT @franchise,@number,@section,@capacity WHERE EXISTS
                (SELECT 1 FROM t_franchise WHERE c_franchise_id=@franchise AND c_user_id=@owner)
            RETURNING c_table_id,c_franchise_id,c_table_number,c_section,c_capacity,c_status,c_active_order_id;
            """;
        await OpenAsync();
        await using var cmd = new NpgsqlCommand(sql, connection);
        cmd.Parameters.AddWithValue("@franchise", table.FranchiseId);
        cmd.Parameters.AddWithValue("@number", table.TableNumber);
        cmd.Parameters.AddWithValue("@section", table.Section);
        cmd.Parameters.AddWithValue("@capacity", table.Capacity);
        cmd.Parameters.AddWithValue("@owner", ownerId);
        await using var reader = await cmd.ExecuteReaderAsync();
        if (!await reader.ReadAsync()) throw new KeyNotFoundException("Franchise not found.");
        return Map(reader);
    }

    public async Task<bool> SetStatusAsync(int ownerId, int tableId, string status, string? activeOrderId)
    {
        const string sql = """
            UPDATE t_dining_table t SET c_status=@status,
                c_active_order_id=CASE WHEN @status IN ('VACANT','BILLED') THEN NULL ELSE @order_id END
            FROM t_franchise f WHERE f.c_franchise_id=t.c_franchise_id AND f.c_user_id=@owner AND t.c_table_id=@id;
            """;
        await OpenAsync();
        await using var cmd = new NpgsqlCommand(sql, connection);
        cmd.Parameters.AddWithValue("@status", status);
        cmd.Parameters.AddWithValue("@order_id", (object?)activeOrderId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@owner", ownerId);
        cmd.Parameters.AddWithValue("@id", tableId);
        return await cmd.ExecuteNonQueryAsync() == 1;
    }

    public async Task<bool> TransferAsync(int ownerId, int sourceTableId, int targetTableId)
    {
        await OpenAsync();
        await using var tx = await connection.BeginTransactionAsync();
        const string lockSql = """
            SELECT t.c_table_id,t.c_franchise_id,t.c_status,t.c_active_order_id
            FROM t_dining_table t JOIN t_franchise f ON f.c_franchise_id=t.c_franchise_id
            WHERE f.c_user_id=@owner AND t.c_table_id IN (@source,@target)
            ORDER BY t.c_table_id FOR UPDATE OF t;
            """;
        var locked = new Dictionary<int,(int FranchiseId,string Status,string? OrderId)>();
        await using (var lockCommand = new NpgsqlCommand(lockSql, connection, tx))
        {
            lockCommand.Parameters.AddWithValue("@owner", ownerId);
            lockCommand.Parameters.AddWithValue("@source", sourceTableId);
            lockCommand.Parameters.AddWithValue("@target", targetTableId);
            await using var reader = await lockCommand.ExecuteReaderAsync();
            while (await reader.ReadAsync()) locked[reader.GetInt32(0)] = (reader.GetInt32(1), reader.GetString(2), reader.IsDBNull(3) ? null : reader.GetString(3));
        }
        if (!locked.TryGetValue(sourceTableId,out var source) || !locked.TryGetValue(targetTableId,out var target)
            || source.FranchiseId!=target.FranchiseId || source.OrderId is null || target.Status!="VACANT")
        { await tx.RollbackAsync(); return false; }
        await using (var targetCmd = new NpgsqlCommand("UPDATE t_dining_table SET c_active_order_id=@order,c_status='OCCUPIED' WHERE c_table_id=@id;", connection, tx))
        {
            targetCmd.Parameters.AddWithValue("@order", source.OrderId); targetCmd.Parameters.AddWithValue("@id", targetTableId); await targetCmd.ExecuteNonQueryAsync();
        }
        await using (var sourceCmd = new NpgsqlCommand("UPDATE t_dining_table SET c_active_order_id=NULL,c_status='VACANT' WHERE c_table_id=@id;", connection, tx))
        { sourceCmd.Parameters.AddWithValue("@id", sourceTableId); await sourceCmd.ExecuteNonQueryAsync(); }
        await tx.CommitAsync();
        return true;
    }

    private async Task OpenAsync() { if (connection.State != System.Data.ConnectionState.Open) await connection.OpenAsync(); }
    private static DiningTable Map(NpgsqlDataReader r) => new()
    {
        Id=r.GetInt32(0),FranchiseId=r.GetInt32(1),TableNumber=r.GetString(2),Section=r.GetString(3),Capacity=r.GetInt32(4),
        Status=r.GetString(5),ActiveOrderId=r.IsDBNull(6)?null:r.GetString(6)
    };
}
