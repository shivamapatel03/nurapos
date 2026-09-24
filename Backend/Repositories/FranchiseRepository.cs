using Npgsql;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;

namespace Nurapos.Repositories;

public class FranchiseRepository : IFranchiseRepository
{
    private readonly NpgsqlConnection _connection;

    public FranchiseRepository(NpgsqlConnection connection)
    {
        _connection = connection;
    }

    public async Task<int> CreateAsync(Franchise franchise)
    {
        const string sql = """
            INSERT INTO t_franchise
            (
                c_franchise_name,
                c_owner_name,
                c_contact,
                c_email,
                c_address,
                c_city,
                c_status
            )
            VALUES
            (
                @franchise_name,
                @owner_name,
                @contact,
                @email,
                @address,
                @city,
                @status
            )
            RETURNING c_franchise_id;
            """;

        await OpenConnectionAsync();

        await using var command = new NpgsqlCommand(sql, _connection);

        command.Parameters.AddWithValue(
            "@franchise_name",
            franchise.FranchiseName
        );

        command.Parameters.AddWithValue(
            "@owner_name",
            (object?)franchise.OwnerName ?? DBNull.Value
        );

        command.Parameters.AddWithValue(
            "@contact",
            (object?)franchise.Contact ?? DBNull.Value
        );

        command.Parameters.AddWithValue(
            "@email",
            (object?)franchise.Email ?? DBNull.Value
        );

        command.Parameters.AddWithValue(
            "@address",
            (object?)franchise.Address ?? DBNull.Value
        );

        command.Parameters.AddWithValue(
            "@city",
            (object?)franchise.City ?? DBNull.Value
        );

        command.Parameters.AddWithValue(
            "@status",
            franchise.Status
        );

        var result = await command.ExecuteScalarAsync();

        return Convert.ToInt32(result);
    }

    public async Task<List<Franchise>> GetAllAsync()
    {
        const string sql = """
            SELECT
                c_franchise_id,
                c_franchise_name,
                c_owner_name,
                c_contact,
                c_email,
                c_address,
                c_city,
                c_status,
                c_created_at
            FROM t_franchise
            ORDER BY c_franchise_id DESC;
            """;

        await OpenConnectionAsync();

        await using var command = new NpgsqlCommand(sql, _connection);

        await using var reader = await command.ExecuteReaderAsync();

        var franchises = new List<Franchise>();

        while (await reader.ReadAsync())
        {
            franchises.Add(MapFranchise(reader));
        }

        return franchises;
    }

    public async Task<Franchise?> GetByIdAsync(int franchiseId)
    {
        const string sql = """
            SELECT
                c_franchise_id,
                c_franchise_name,
                c_owner_name,
                c_contact,
                c_email,
                c_address,
                c_city,
                c_status,
                c_created_at
            FROM t_franchise
            WHERE c_franchise_id = @franchise_id;
            """;

        await OpenConnectionAsync();

        await using var command = new NpgsqlCommand(sql, _connection);

        command.Parameters.AddWithValue(
            "@franchise_id",
            franchiseId
        );

        await using var reader = await command.ExecuteReaderAsync();

        if (!await reader.ReadAsync())
        {
            return null;
        }

        return MapFranchise(reader);
    }

    public async Task<bool> UpdateAsync(Franchise franchise)
    {
        const string sql = """
            UPDATE t_franchise
            SET
                c_franchise_name = @franchise_name,
                c_owner_name = @owner_name,
                c_contact = @contact,
                c_email = @email,
                c_address = @address,
                c_city = @city,
                c_status = @status
            WHERE c_franchise_id = @franchise_id;
            """;

        await OpenConnectionAsync();

        await using var command = new NpgsqlCommand(sql, _connection);

        command.Parameters.AddWithValue(
            "@franchise_id",
            franchise.FranchiseId
        );

        command.Parameters.AddWithValue(
            "@franchise_name",
            franchise.FranchiseName
        );

        command.Parameters.AddWithValue(
            "@owner_name",
            (object?)franchise.OwnerName ?? DBNull.Value
        );

        command.Parameters.AddWithValue(
            "@contact",
            (object?)franchise.Contact ?? DBNull.Value
        );

        command.Parameters.AddWithValue(
            "@email",
            (object?)franchise.Email ?? DBNull.Value
        );

        command.Parameters.AddWithValue(
            "@address",
            (object?)franchise.Address ?? DBNull.Value
        );

        command.Parameters.AddWithValue(
            "@city",
            (object?)franchise.City ?? DBNull.Value
        );

        command.Parameters.AddWithValue(
            "@status",
            franchise.Status
        );

        var affectedRows = await command.ExecuteNonQueryAsync();

        return affectedRows > 0;
    }

    public async Task<bool> DeleteAsync(int franchiseId)
    {
        const string sql = """
            DELETE FROM t_franchise
            WHERE c_franchise_id = @franchise_id;
            """;

        await OpenConnectionAsync();

        await using var command = new NpgsqlCommand(sql, _connection);

        command.Parameters.AddWithValue(
            "@franchise_id",
            franchiseId
        );

        var affectedRows = await command.ExecuteNonQueryAsync();

        return affectedRows > 0;
    }

    public async Task<bool> ExistsAsync(int franchiseId)
    {
        const string sql = """
            SELECT EXISTS
            (
                SELECT 1
                FROM t_franchise
                WHERE c_franchise_id = @franchise_id
            );
            """;

        await OpenConnectionAsync();

        await using var command = new NpgsqlCommand(sql, _connection);

        command.Parameters.AddWithValue(
            "@franchise_id",
            franchiseId
        );

        var result = await command.ExecuteScalarAsync();

        return Convert.ToBoolean(result);
    }

    public async Task<bool> EmailExistsAsync(
    string email,
    int? excludeFranchiseId = null)
{
    string sql;

    if (excludeFranchiseId.HasValue)
    {
        sql = """
            SELECT EXISTS
            (
                SELECT 1
                FROM t_franchise
                WHERE LOWER(c_email) = LOWER(@email)
                AND c_franchise_id <> @exclude_id
            );
            """;
    }
    else
    {
        sql = """
            SELECT EXISTS
            (
                SELECT 1
                FROM t_franchise
                WHERE LOWER(c_email) = LOWER(@email)
            );
            """;
    }

    await OpenConnectionAsync();

    await using var command = new NpgsqlCommand(sql, _connection);

    command.Parameters.AddWithValue(
        "@email",
        email);

    if (excludeFranchiseId.HasValue)
    {
        command.Parameters.AddWithValue(
            "@exclude_id",
            excludeFranchiseId.Value);
    }

    var result = await command.ExecuteScalarAsync();

    return Convert.ToBoolean(result);
}

    private async Task OpenConnectionAsync()
    {
        if (_connection.State != System.Data.ConnectionState.Open)
        {
            await _connection.OpenAsync();
        }
    }

    private static Franchise MapFranchise(NpgsqlDataReader reader)
    {
        return new Franchise
        {
            FranchiseId = reader.GetInt32(
                reader.GetOrdinal("c_franchise_id")
            ),

            FranchiseName = reader.GetString(
                reader.GetOrdinal("c_franchise_name")
            ),

            OwnerName = reader.IsDBNull(
                reader.GetOrdinal("c_owner_name")
            )
                ? null
                : reader.GetString(
                    reader.GetOrdinal("c_owner_name")
                ),

            Contact = reader.IsDBNull(
                reader.GetOrdinal("c_contact")
            )
                ? null
                : reader.GetString(
                    reader.GetOrdinal("c_contact")
                ),

            Email = reader.IsDBNull(
                reader.GetOrdinal("c_email")
            )
                ? null
                : reader.GetString(
                    reader.GetOrdinal("c_email")
                ),

            Address = reader.IsDBNull(
                reader.GetOrdinal("c_address")
            )
                ? null
                : reader.GetString(
                    reader.GetOrdinal("c_address")
                ),

            City = reader.IsDBNull(
                reader.GetOrdinal("c_city")
            )
                ? null
                : reader.GetString(
                    reader.GetOrdinal("c_city")
                ),

            Status = reader.GetString(
                reader.GetOrdinal("c_status")
            ),

            CreatedAt = reader.GetDateTime(
                reader.GetOrdinal("c_created_at")
            )
        };
    }
}