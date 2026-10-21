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
                c_is_verified BOOLEAN NOT NULL DEFAULT TRUE,
                c_created_at TIMESTAMP DEFAULT now()
            );
            """;

        await OpenConnectionAsync();

        await using var command = new NpgsqlCommand(sql, _connection);
        await command.ExecuteNonQueryAsync();

        await using (var verifiedColumnCommand = new NpgsqlCommand(
            "ALTER TABLE t_user ADD COLUMN IF NOT EXISTS c_is_verified BOOLEAN NOT NULL DEFAULT TRUE;", _connection))
        {
            await verifiedColumnCommand.ExecuteNonQueryAsync();
        }

        await using (var pinColumnCommand = new NpgsqlCommand(
            "ALTER TABLE t_user ADD COLUMN IF NOT EXISTS c_pos_pin_hash TEXT;", _connection))
        {
            await pinColumnCommand.ExecuteNonQueryAsync();
        }

        const string refreshTokensSql = """
            CREATE TABLE IF NOT EXISTS t_refresh_token (
                c_refresh_token_id BIGSERIAL PRIMARY KEY,
                c_user_id INT NOT NULL REFERENCES t_user(c_user_id) ON DELETE CASCADE,
                c_token_hash TEXT NOT NULL UNIQUE,
                c_expires_at TIMESTAMPTZ NOT NULL,
                c_created_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );
            CREATE INDEX IF NOT EXISTS ix_refresh_token_user_id
                ON t_refresh_token(c_user_id);
            """;

        await using var refreshCommand = new NpgsqlCommand(refreshTokensSql, _connection);
        await refreshCommand.ExecuteNonQueryAsync();
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
                c_is_verified
            )
            VALUES
            (
                @name,
                @email,
                @password_hash,
                @role,
                @is_verified
            )
            RETURNING c_user_id;
            """;

        await OpenConnectionAsync();

        await using var command = new NpgsqlCommand(sql, _connection);

        command.Parameters.AddWithValue("@name", user.Name);
        command.Parameters.AddWithValue("@email", user.Email);
        command.Parameters.AddWithValue("@password_hash", user.PasswordHash);
        command.Parameters.AddWithValue("@role", user.Role);
        command.Parameters.AddWithValue("@is_verified", user.IsVerified);

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
                c_is_verified,
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
            IsVerified = reader.GetBoolean(reader.GetOrdinal("c_is_verified")),
            CreatedAt = reader.GetDateTime(reader.GetOrdinal("c_created_at"))
        };
    }

    public async Task<User?> GetByIdAsync(int userId)
    {
        const string sql = """
            SELECT c_user_id, c_name, c_email, c_password_hash, c_role, c_is_verified, c_created_at
            FROM t_user
            WHERE c_user_id = @user_id;
            """;

        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, _connection);
        command.Parameters.AddWithValue("@user_id", userId);
        await using var reader = await command.ExecuteReaderAsync();
        return await reader.ReadAsync() ? MapUser(reader) : null;
    }

    public async Task<bool> HasPosPinAsync(int userId)
    {
        const string sql = "SELECT c_pos_pin_hash IS NOT NULL FROM t_user WHERE c_user_id = @user_id;";
        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, _connection);
        command.Parameters.AddWithValue("@user_id", userId);
        return (bool?)await command.ExecuteScalarAsync() ?? false;
    }

    public async Task<bool> SetPosPinHashAsync(int userId, string pinHash)
    {
        const string sql = "UPDATE t_user SET c_pos_pin_hash = @pin_hash WHERE c_user_id = @user_id AND c_pos_pin_hash IS NULL;";
        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, _connection);
        command.Parameters.AddWithValue("@user_id", userId);
        command.Parameters.AddWithValue("@pin_hash", pinHash);
        return await command.ExecuteNonQueryAsync() == 1;
    }

    public async Task<string?> GetPosPinHashAsync(int userId)
    {
        const string sql = "SELECT c_pos_pin_hash FROM t_user WHERE c_user_id = @user_id;";
        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, _connection);
        command.Parameters.AddWithValue("@user_id", userId);
        return await command.ExecuteScalarAsync() as string;
    }

    public async Task StoreRefreshTokenAsync(
        int userId,
        string tokenHash,
        DateTime expiresAtUtc)
    {
        const string sql = """
            INSERT INTO t_refresh_token (c_user_id, c_token_hash, c_expires_at)
            VALUES (@user_id, @token_hash, @expires_at);
            """;

        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, _connection);
        command.Parameters.AddWithValue("@user_id", userId);
        command.Parameters.AddWithValue("@token_hash", tokenHash);
        command.Parameters.AddWithValue("@expires_at", expiresAtUtc);
        await command.ExecuteNonQueryAsync();
    }

    public async Task<User?> RotateRefreshTokenAsync(
        string currentTokenHash,
        string replacementTokenHash,
        DateTime replacementExpiresAtUtc)
    {
        await OpenConnectionAsync();
        await using var transaction = await _connection.BeginTransactionAsync();

        const string updateSql = """
            UPDATE t_refresh_token
            SET c_token_hash = @replacement_hash,
                c_expires_at = @replacement_expires_at,
                c_created_at = now()
            WHERE c_token_hash = @current_hash
              AND c_expires_at > now()
            RETURNING c_user_id;
            """;

        await using var updateCommand = new NpgsqlCommand(updateSql, _connection, transaction);
        updateCommand.Parameters.AddWithValue("@replacement_hash", replacementTokenHash);
        updateCommand.Parameters.AddWithValue("@replacement_expires_at", replacementExpiresAtUtc);
        updateCommand.Parameters.AddWithValue("@current_hash", currentTokenHash);

        var userIdValue = await updateCommand.ExecuteScalarAsync();
        if (userIdValue == null || userIdValue == DBNull.Value)
        {
            await transaction.RollbackAsync();
            return null;
        }

        const string userSql = """
            SELECT c_user_id, c_name, c_email, c_password_hash, c_role, c_is_verified, c_created_at
            FROM t_user
            WHERE c_user_id = @user_id;
            """;

        await using var userCommand = new NpgsqlCommand(userSql, _connection, transaction);
        userCommand.Parameters.AddWithValue("@user_id", Convert.ToInt32(userIdValue));
        await using var reader = await userCommand.ExecuteReaderAsync();
        var user = await reader.ReadAsync() ? MapUser(reader) : null;
        await reader.DisposeAsync();

        if (user == null)
        {
            await transaction.RollbackAsync();
            return null;
        }

        await transaction.CommitAsync();
        return user;
    }

    public async Task<bool> RevokeRefreshTokenAsync(string tokenHash)
    {
        const string sql = "DELETE FROM t_refresh_token WHERE c_token_hash = @token_hash;";
        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, _connection);
        command.Parameters.AddWithValue("@token_hash", tokenHash);
        return await command.ExecuteNonQueryAsync() > 0;
    }

    public async Task<bool> SetEmailVerifiedAsync(int userId)
    {
        const string sql = "UPDATE t_user SET c_is_verified = TRUE WHERE c_user_id = @user_id;";
        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, _connection);
        command.Parameters.AddWithValue("@user_id", userId);
        return await command.ExecuteNonQueryAsync() == 1;
    }

    public async Task<bool> UpdatePasswordAndRevokeRefreshTokensAsync(int userId, string passwordHash)
    {
        await OpenConnectionAsync();
        await using var transaction = await _connection.BeginTransactionAsync();
        const string updatePassword = "UPDATE t_user SET c_password_hash = @password_hash WHERE c_user_id = @user_id;";
        await using var passwordCommand = new NpgsqlCommand(updatePassword, _connection, transaction);
        passwordCommand.Parameters.AddWithValue("@password_hash", passwordHash);
        passwordCommand.Parameters.AddWithValue("@user_id", userId);
        var changed = await passwordCommand.ExecuteNonQueryAsync();
        if (changed != 1) { await transaction.RollbackAsync(); return false; }
        await using var revokeCommand = new NpgsqlCommand("DELETE FROM t_refresh_token WHERE c_user_id = @user_id;", _connection, transaction);
        revokeCommand.Parameters.AddWithValue("@user_id", userId);
        await revokeCommand.ExecuteNonQueryAsync();
        await transaction.CommitAsync();
        return true;
    }

    private static User MapUser(NpgsqlDataReader reader)
    {
        return new User
        {
            UserId = reader.GetInt32(reader.GetOrdinal("c_user_id")),
            Name = reader.GetString(reader.GetOrdinal("c_name")),
            Email = reader.GetString(reader.GetOrdinal("c_email")),
            PasswordHash = reader.GetString(reader.GetOrdinal("c_password_hash")),
            Role = reader.GetString(reader.GetOrdinal("c_role")),
            IsVerified = reader.GetBoolean(reader.GetOrdinal("c_is_verified")),
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
