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

    public async Task EnsureFranchiseSchemaAsync()
    {
        const string sql = """
            ALTER TABLE t_franchise ADD COLUMN IF NOT EXISTS c_user_id INT;
            ALTER TABLE t_franchise DROP COLUMN IF EXISTS c_email;
            ALTER TABLE t_category ADD COLUMN IF NOT EXISTS c_user_id INT;
            ALTER TABLE t_expense_category ADD COLUMN IF NOT EXISTS c_user_id INT;
            ALTER TABLE t_supplier ADD COLUMN IF NOT EXISTS c_user_id INT;
            ALTER TABLE t_product ADD COLUMN IF NOT EXISTS c_user_id INT;
            ALTER TABLE t_category DROP CONSTRAINT IF EXISTS t_category_c_category_name_key;
            ALTER TABLE t_expense_category DROP CONSTRAINT IF EXISTS t_expense_category_c_expense_category_name_key;
            CREATE UNIQUE INDEX IF NOT EXISTS uq_category_owner_name
                ON t_category(c_user_id, c_category_name);
            CREATE UNIQUE INDEX IF NOT EXISTS uq_expense_category_owner_name
                ON t_expense_category(c_user_id, c_expense_category_name);
            CREATE INDEX IF NOT EXISTS ix_supplier_owner_id ON t_supplier(c_user_id);
            CREATE INDEX IF NOT EXISTS ix_product_owner_id ON t_product(c_user_id);
            CREATE TABLE IF NOT EXISTS t_owner_payment_mode (
                c_payment_mode_id SERIAL PRIMARY KEY,
                c_user_id INT NOT NULL REFERENCES t_user(c_user_id) ON DELETE CASCADE,
                c_mode_name VARCHAR(20) NOT NULL,
                c_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                c_created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT chk_owner_payment_mode_status CHECK (c_status IN ('ACTIVE', 'INACTIVE'))
            );
            CREATE UNIQUE INDEX IF NOT EXISTS uq_owner_payment_mode_user_name
                ON t_owner_payment_mode(c_user_id, LOWER(c_mode_name));
            """;
        await OpenConnectionAsync();
        await using var command = new NpgsqlCommand(sql, _connection);
        await command.ExecuteNonQueryAsync();
    }

    public async Task<int> CreateAsync(Franchise franchise)
    {
        const string sql = """
            INSERT INTO t_franchise
            (
                c_franchise_name,
                c_user_id,
                c_owner_name,
                c_contact,
                c_address,
                c_city,
                c_status
            )
            VALUES
            (
                @franchise_name,
                @user_id,
                @owner_name,
                @contact,
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
            "@user_id",
            (object?)franchise.UserId ?? DBNull.Value
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

    public async Task<List<Franchise>> GetAllAsync(int userId)
    {
        const string sql = """
            SELECT
                c_franchise_id,
                c_franchise_name,
                c_user_id,
                c_owner_name,
                c_contact,
                c_address,
                c_city,
                c_status,
                c_created_at
            FROM t_franchise
            WHERE c_user_id = @user_id
            ORDER BY c_franchise_id DESC;
            """;

        await OpenConnectionAsync();

        await using var command = new NpgsqlCommand(sql, _connection);
        command.Parameters.AddWithValue("@user_id", userId);

        await using var reader = await command.ExecuteReaderAsync();

        var franchises = new List<Franchise>();

        while (await reader.ReadAsync())
        {
            franchises.Add(MapFranchise(reader));
        }

        return franchises;
    }

    public async Task<Franchise?> GetByIdAsync(int franchiseId, int userId)
    {
        const string sql = """
            SELECT
                c_franchise_id,
                c_franchise_name,
                c_user_id,
                c_owner_name,
                c_contact,
                c_address,
                c_city,
                c_status,
                c_created_at
            FROM t_franchise
            WHERE c_franchise_id = @franchise_id AND c_user_id = @user_id;
            """;

        await OpenConnectionAsync();

        await using var command = new NpgsqlCommand(sql, _connection);

        command.Parameters.AddWithValue(
            "@franchise_id",
            franchiseId
        );
        command.Parameters.AddWithValue("@user_id", userId);

        await using var reader = await command.ExecuteReaderAsync();

        if (!await reader.ReadAsync())
        {
            return null;
        }

        return MapFranchise(reader);
    }

    public async Task<bool> UpdateAsync(Franchise franchise, int userId)
    {
        const string sql = """
            UPDATE t_franchise
            SET
                c_franchise_name = @franchise_name,
                c_owner_name = @owner_name,
                c_contact = @contact,
                c_address = @address,
                c_city = @city,
                c_status = @status
            WHERE c_franchise_id = @franchise_id AND c_user_id = @user_id;
            """;

        await OpenConnectionAsync();

        await using var command = new NpgsqlCommand(sql, _connection);

        command.Parameters.AddWithValue(
            "@franchise_id",
            franchise.FranchiseId
        );
        command.Parameters.AddWithValue("@user_id", userId);

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

    public async Task<bool> DeleteAsync(int franchiseId, int userId)
    {
        const string sql = """
            DELETE FROM t_franchise
            WHERE c_franchise_id = @franchise_id AND c_user_id = @user_id;
            """;

        await OpenConnectionAsync();

        await using var command = new NpgsqlCommand(sql, _connection);

        command.Parameters.AddWithValue(
            "@franchise_id",
            franchiseId
        );
        command.Parameters.AddWithValue("@user_id", userId);

        var affectedRows = await command.ExecuteNonQueryAsync();

        return affectedRows > 0;
    }

    public async Task<bool> ExistsAsync(int franchiseId, int userId)
    {
        const string sql = """
            SELECT EXISTS
            (
                SELECT 1
                FROM t_franchise
                WHERE c_franchise_id = @franchise_id AND c_user_id = @user_id
            );
            """;

        await OpenConnectionAsync();

        await using var command = new NpgsqlCommand(sql, _connection);

        command.Parameters.AddWithValue(
            "@franchise_id",
            franchiseId
        );
        command.Parameters.AddWithValue("@user_id", userId);

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

            UserId = reader.IsDBNull(reader.GetOrdinal("c_user_id"))
                ? null
                : reader.GetInt32(reader.GetOrdinal("c_user_id")),

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
