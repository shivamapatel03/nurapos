using Npgsql;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;

namespace Nurapos.Repositories;

public sealed class UploadRepository(NpgsqlConnection connection):IUploadRepository
{
    public async Task EnsureSchemaAsync()
    {
        const string sql="""
            CREATE TABLE IF NOT EXISTS t_uploaded_asset(
                c_asset_id SERIAL PRIMARY KEY,
                c_user_id INT NOT NULL REFERENCES t_user(c_user_id) ON DELETE CASCADE,
                c_purpose VARCHAR(24) NOT NULL,
                c_stored_name VARCHAR(80) NOT NULL UNIQUE,
                c_content_type VARCHAR(80) NOT NULL,
                c_size_bytes BIGINT NOT NULL,
                c_created_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );
            """;
        await OpenAsync();await using var cmd=new NpgsqlCommand(sql,connection);await cmd.ExecuteNonQueryAsync();
    }
    public async Task<UploadedAsset>CreateAsync(UploadedAsset asset)
    {
        const string sql="INSERT INTO t_uploaded_asset(c_user_id,c_purpose,c_stored_name,c_content_type,c_size_bytes) VALUES(@owner,@purpose,@name,@type,@size) RETURNING c_asset_id,c_created_at;";
        await OpenAsync();await using var cmd=new NpgsqlCommand(sql,connection);cmd.Parameters.AddWithValue("@owner",asset.OwnerId);cmd.Parameters.AddWithValue("@purpose",asset.Purpose);cmd.Parameters.AddWithValue("@name",asset.StoredName);cmd.Parameters.AddWithValue("@type",asset.ContentType);cmd.Parameters.AddWithValue("@size",asset.SizeBytes);
        await using var r=await cmd.ExecuteReaderAsync();await r.ReadAsync();asset.Id=r.GetInt32(0);asset.CreatedAtUtc=r.GetDateTime(1);return asset;
    }
    public async Task<UploadedAsset?>GetAsync(int ownerId,int assetId)
    {
        const string sql="SELECT c_asset_id,c_user_id,c_purpose,c_stored_name,c_content_type,c_size_bytes,c_created_at FROM t_uploaded_asset WHERE c_user_id=@owner AND c_asset_id=@id;";
        await OpenAsync();await using var cmd=new NpgsqlCommand(sql,connection);cmd.Parameters.AddWithValue("@owner",ownerId);cmd.Parameters.AddWithValue("@id",assetId);await using var r=await cmd.ExecuteReaderAsync();
        return await r.ReadAsync()?new UploadedAsset{Id=r.GetInt32(0),OwnerId=r.GetInt32(1),Purpose=r.GetString(2),StoredName=r.GetString(3),ContentType=r.GetString(4),SizeBytes=r.GetInt64(5),CreatedAtUtc=r.GetDateTime(6)}:null;
    }
    private async Task OpenAsync(){if(connection.State!=System.Data.ConnectionState.Open)await connection.OpenAsync();}
}
