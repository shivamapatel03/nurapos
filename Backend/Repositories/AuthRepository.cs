using Npgsql;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;

namespace Nurapos.Repositories;

public class AuthRepository : IAuthRepository
{
    private readonly NpgsqlConnection _connection;

    public AuthRepository(NpgsqlConnection connection)
    {
        _connection = connection;
    }

    public async Task CreateUsersTableIfNotExistsAsync()
    {
        const string sql = """
            CREATE TABLE IF NOT EXISTS t_user (
                c_user_id SERIAL PRIMARY KEY,
                c_name TEXT NOT NULL,
                c_email TEXT UNIQUE NOT NULL,
                c_password_hash TEXT NOT NULL,
                c_role TEXT NOT NULL,
                c_franchise_id INT,
                c_created_at TIMESTAMP DEFAULT now()
            );
            """;

        await OpenConnectionAsync();

        await using var command = new NpgsqlCommand(sql, _connection);
        await command.ExecuteNonQueryAsync();
    }

    public async Task<int> CreateUserAsync(User user)
    {
        const string sql = """
            INSERT INTO t_user
            (
                c_name,
                c_email,
                c_password_hash,
                c_role,
                c_franchise_id
            )
            VALUES
            (
                @name,
                @email,
                @password_hash,
                @role,
                @franchise_id
            )
            RETURNING c_user_id;
            """;

        await OpenConnectionAsync();

        await using var command = new NpgsqlCommand(sql, _connection);

        command.Parameters.AddWithValue("@name", user.Name);
        command.Parameters.AddWithValue("@email", user.Email);
        command.Parameters.AddWithValue("@password_hash", user.PasswordHash);
        command.Parameters.AddWithValue("@role", user.Role);
        command.Parameters.AddWithValue("@franchise_id", (object?)user.FranchiseId ?? DBNull.Value);

        var result = await command.ExecuteScalarAsync();

        return Convert.ToInt32(result);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        const string sql = """
            SELECT
                c_user_id,
                c_name,
                c_email,
                c_password_hash,
                c_role,
                c_franchise_id,
                c_created_at
            FROM t_user
            WHERE LOWER(c_email) = LOWER(@email)
            LIMIT 1;
            """;

        await OpenConnectionAsync();

        await using var command = new NpgsqlCommand(sql, _connection);
        command.Parameters.AddWithValue("@email", email);

        await using var reader = await command.ExecuteReaderAsync();

        if (!await reader.ReadAsync())
        {
            return null;
        }

        return new User
        {
            UserId = reader.GetInt32(reader.GetOrdinal("c_user_id")),
            Name = reader.GetString(reader.GetOrdinal("c_name")),
            Email = reader.GetString(reader.GetOrdinal("c_email")),
            PasswordHash = reader.GetString(reader.GetOrdinal("c_password_hash")),
            Role = reader.GetString(reader.GetOrdinal("c_role")),
            FranchiseId = reader.IsDBNull(reader.GetOrdinal("c_franchise_id")) ? null : reader.GetInt32(reader.GetOrdinal("c_franchise_id")),
            CreatedAt = reader.GetDateTime(reader.GetOrdinal("c_created_at"))
        };
    }

    private async Task OpenConnectionAsync()
    {
        if (_connection.State != System.Data.ConnectionState.Open)
        {
            await _connection.OpenAsync();
        }
    }
}
