using Npgsql;
using NpgsqlTypes;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;

namespace Nurapos.Repositories;

public sealed class SettingsRepository(NpgsqlConnection connection):ISettingsRepository
{
    public async Task EnsureSchemaAsync()
    {
        const string sql="""
            CREATE TABLE IF NOT EXISTS t_owner_settings(
                c_user_id INT NOT NULL REFERENCES t_user(c_user_id) ON DELETE CASCADE,
                c_category VARCHAR(32) NOT NULL,
                c_value JSONB NOT NULL,
                c_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                PRIMARY KEY(c_user_id,c_category)
            );
            """;
        await OpenAsync();await using var cmd=new NpgsqlCommand(sql,connection);await cmd.ExecuteNonQueryAsync();
    }
    public async Task<SettingsEntry?> GetAsync(int ownerId,string category)
    {
        const string sql="SELECT c_user_id,c_category,c_value::text,c_updated_at FROM t_owner_settings WHERE c_user_id=@owner AND c_category=@category;";
        await OpenAsync();await using var cmd=new NpgsqlCommand(sql,connection);cmd.Parameters.AddWithValue("@owner",ownerId);cmd.Parameters.AddWithValue("@category",category);
        await using var r=await cmd.ExecuteReaderAsync();return await r.ReadAsync()?new SettingsEntry{OwnerId=r.GetInt32(0),Category=r.GetString(1),JsonValue=r.GetString(2),UpdatedAtUtc=r.GetDateTime(3)}:null;
    }
    public async Task UpsertAsync(SettingsEntry entry)
    {
        const string sql="""
            INSERT INTO t_owner_settings(c_user_id,c_category,c_value) VALUES(@owner,@category,@value)
            ON CONFLICT(c_user_id,c_category) DO UPDATE SET c_value=EXCLUDED.c_value,c_updated_at=now();
            """;
        await OpenAsync();await using var cmd=new NpgsqlCommand(sql,connection);cmd.Parameters.AddWithValue("@owner",entry.OwnerId);cmd.Parameters.AddWithValue("@category",entry.Category);
        cmd.Parameters.Add(new NpgsqlParameter("@value",NpgsqlDbType.Jsonb){Value=entry.JsonValue});await cmd.ExecuteNonQueryAsync();
    }
    private async Task OpenAsync(){if(connection.State!=System.Data.ConnectionState.Open)await connection.OpenAsync();}
}
