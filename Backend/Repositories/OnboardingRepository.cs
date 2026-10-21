using Npgsql;
using NpgsqlTypes;
using System.Text.Json;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;

namespace Nurapos.Repositories;

public sealed class OnboardingRepository(NpgsqlConnection connection) : IOnboardingRepository
{
    public async Task EnsureSchemaAsync()
    {
        const string sql = """
            CREATE TABLE IF NOT EXISTS t_onboarding_draft (
                c_user_id INT PRIMARY KEY REFERENCES t_user(c_user_id) ON DELETE CASCADE,
                c_draft JSONB NOT NULL DEFAULT '{}'::jsonb,
                c_current_step INT NOT NULL DEFAULT 2 CHECK (c_current_step BETWEEN 2 AND 6),
                c_is_completed BOOLEAN NOT NULL DEFAULT FALSE,
                c_updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );
            CREATE TABLE IF NOT EXISTS t_store_profile (
                c_franchise_id INT PRIMARY KEY REFERENCES t_franchise(c_franchise_id) ON DELETE CASCADE,
                c_user_id INT NOT NULL REFERENCES t_user(c_user_id) ON DELETE CASCADE,
                c_business_name VARCHAR(160) NOT NULL,
                c_business_type VARCHAR(80),
                c_country_code VARCHAR(8),
                c_dial_code VARCHAR(8),
                c_phone_number VARCHAR(32),
                c_store_name VARCHAR(120) NOT NULL,
                c_store_code VARCHAR(32) NOT NULL,
                c_store_address VARCHAR(500),
                c_city VARCHAR(100),
                c_payment_methods JSONB NOT NULL DEFAULT '{}'::jsonb,
                c_hardware JSONB NOT NULL DEFAULT '{}'::jsonb,
                c_created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                CONSTRAINT uq_store_profile_owner_code UNIQUE(c_user_id,c_store_code)
            );
            CREATE TABLE IF NOT EXISTS t_store_payment_mode (
                c_franchise_id INT NOT NULL REFERENCES t_franchise(c_franchise_id) ON DELETE CASCADE,
                c_mode_name VARCHAR(24) NOT NULL,
                c_is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
                PRIMARY KEY(c_franchise_id,c_mode_name)
            );
            """;
        if (connection.State != System.Data.ConnectionState.Open) await connection.OpenAsync();
        await using var command = new NpgsqlCommand(sql, connection);
        await command.ExecuteNonQueryAsync();
    }

    public async Task<OnboardingRecord?> GetAsync(int userId)
    {
        const string sql = "SELECT c_user_id, c_draft::text, c_current_step, c_is_completed, c_updated_at FROM t_onboarding_draft WHERE c_user_id = @id;";
        await OpenAsync();
        await using var command = new NpgsqlCommand(sql, connection);
        command.Parameters.AddWithValue("@id", userId);
        await using var reader = await command.ExecuteReaderAsync();
        if (!await reader.ReadAsync()) return null;
        return new OnboardingRecord
        {
            UserId = reader.GetInt32(0), DraftJson = reader.GetString(1),
            CurrentStep = reader.GetInt32(2), IsCompleted = reader.GetBoolean(3),
            UpdatedAtUtc = reader.GetDateTime(4)
        };
    }

    public async Task UpsertDraftAsync(OnboardingRecord record)
    {
        const string sql = """
            INSERT INTO t_onboarding_draft (c_user_id, c_draft, c_current_step)
            VALUES (@id, @draft, @step)
            ON CONFLICT (c_user_id) DO UPDATE SET
                c_draft = EXCLUDED.c_draft,
                c_current_step = GREATEST(t_onboarding_draft.c_current_step, EXCLUDED.c_current_step),
                c_updated_at = now()
            WHERE t_onboarding_draft.c_is_completed = FALSE;
            """;
        await OpenAsync();
        await using var command = new NpgsqlCommand(sql, connection);
        command.Parameters.AddWithValue("@id", record.UserId);
        command.Parameters.Add(new NpgsqlParameter("@draft", NpgsqlDbType.Jsonb) { Value = record.DraftJson });
        command.Parameters.AddWithValue("@step", record.CurrentStep);
        var changed = await command.ExecuteNonQueryAsync();
        if (changed == 0) throw new InvalidOperationException("Completed onboarding cannot be changed.");
    }

    public async Task<bool> CompleteAsync(int userId)
    {
        await OpenAsync();
        await using var transaction = await connection.BeginTransactionAsync();
        const string readSql = "SELECT c_draft::text,c_is_completed FROM t_onboarding_draft WHERE c_user_id=@id FOR UPDATE;";
        string json;
        await using (var readCommand = new NpgsqlCommand(readSql, connection, transaction))
        {
            readCommand.Parameters.AddWithValue("@id", userId);
            await using var reader = await readCommand.ExecuteReaderAsync();
            if (!await reader.ReadAsync() || reader.GetBoolean(1)) { await transaction.RollbackAsync(); return false; }
            json = reader.GetString(0);
        }

        using var document = JsonDocument.Parse(json);
        var root = document.RootElement;
        var businessName = ReadText(root, "businessName");
        var businessType = ReadText(root, "businessType");
        var countryCode = ReadText(root, "countryCode");
        var dialCode = ReadText(root, "dialCode");
        var phone = ReadText(root, "phoneNumber");
        var storeName = ReadText(root, "storeName");
        var storeCode = ReadText(root, "storeCode");
        var address = ReadText(root, "storeAddress");
        var city = ReadText(root, "city");
        if (string.IsNullOrWhiteSpace(businessName) || string.IsNullOrWhiteSpace(storeName) || string.IsNullOrWhiteSpace(storeCode))
        {
            await transaction.RollbackAsync();
            throw new ArgumentException("Business name, store name, and store code are required to complete onboarding.");
        }

        const string franchiseSql = """
            INSERT INTO t_franchise(c_franchise_name,c_user_id,c_owner_name,c_contact,c_address,c_city,c_status)
            VALUES(@store_name,@user_id,@business_name,@phone,@address,@city,'ACTIVE') RETURNING c_franchise_id;
            """;
        int franchiseId;
        await using (var franchiseCommand = new NpgsqlCommand(franchiseSql, connection, transaction))
        {
            franchiseCommand.Parameters.AddWithValue("@store_name", storeName);
            franchiseCommand.Parameters.AddWithValue("@user_id", userId);
            franchiseCommand.Parameters.AddWithValue("@business_name", businessName);
            franchiseCommand.Parameters.AddWithValue("@phone", (object?)phone ?? DBNull.Value);
            franchiseCommand.Parameters.AddWithValue("@address", (object?)address ?? DBNull.Value);
            franchiseCommand.Parameters.AddWithValue("@city", (object?)city ?? DBNull.Value);
            franchiseId = Convert.ToInt32(await franchiseCommand.ExecuteScalarAsync());
        }

        var paymentMethods = ReadObjectJson(root, "paymentMethods");
        var hardware = JsonSerializer.Serialize(new
        {
            hasCashDrawer = ReadElement(root, "hasCashDrawer"),
            printerStatus = ReadElement(root, "printerStatus")
        });
        const string profileSql = """
            INSERT INTO t_store_profile(c_franchise_id,c_user_id,c_business_name,c_business_type,c_country_code,c_dial_code,c_phone_number,
                c_store_name,c_store_code,c_store_address,c_city,c_payment_methods,c_hardware)
            VALUES(@franchise,@user,@business,@type,@country,@dial,@phone,@store,@code,@address,@city,@payments,@hardware);
            """;
        await using (var profileCommand = new NpgsqlCommand(profileSql, connection, transaction))
        {
            profileCommand.Parameters.AddWithValue("@franchise", franchiseId); profileCommand.Parameters.AddWithValue("@user", userId);
            profileCommand.Parameters.AddWithValue("@business", businessName); profileCommand.Parameters.AddWithValue("@type", (object?)businessType ?? DBNull.Value);
            profileCommand.Parameters.AddWithValue("@country", (object?)countryCode ?? DBNull.Value); profileCommand.Parameters.AddWithValue("@dial", (object?)dialCode ?? DBNull.Value);
            profileCommand.Parameters.AddWithValue("@phone", (object?)phone ?? DBNull.Value); profileCommand.Parameters.AddWithValue("@store", storeName);
            profileCommand.Parameters.AddWithValue("@code", storeCode); profileCommand.Parameters.AddWithValue("@address", (object?)address ?? DBNull.Value);
            profileCommand.Parameters.AddWithValue("@city", (object?)city ?? DBNull.Value);
            profileCommand.Parameters.Add(new NpgsqlParameter("@payments", NpgsqlDbType.Jsonb) { Value = paymentMethods });
            profileCommand.Parameters.Add(new NpgsqlParameter("@hardware", NpgsqlDbType.Jsonb) { Value = hardware });
            await profileCommand.ExecuteNonQueryAsync();
        }

        const string paymentSql = """
            INSERT INTO t_store_payment_mode(c_franchise_id,c_mode_name,c_is_enabled)
            SELECT @franchise,key,value::boolean FROM jsonb_each_text(@payments) WHERE value::boolean;
            """;
        await using (var paymentCommand = new NpgsqlCommand(paymentSql, connection, transaction))
        {
            paymentCommand.Parameters.AddWithValue("@franchise", franchiseId);
            paymentCommand.Parameters.Add(new NpgsqlParameter("@payments", NpgsqlDbType.Jsonb) { Value = paymentMethods });
            await paymentCommand.ExecuteNonQueryAsync();
        }

        if (root.TryGetProperty("staff", out var staff) && staff.ValueKind == JsonValueKind.Array)
        {
            const string staffSql = """
                INSERT INTO t_employee(c_franchise_id,c_employee_code,c_name,c_role,c_phone,c_email)
                VALUES(@franchise,@code,@name,@role,@phone,@email);
                """;
            foreach (var item in staff.EnumerateArray())
            {
                var name = ReadText(item, "name");
                if (string.IsNullOrWhiteSpace(name)) continue;
                var code = ReadText(item, "employeeCode") ?? ReadText(item, "employeeId") ?? $"EMP-{Guid.NewGuid():N}"[..12];
                await using var staffCommand = new NpgsqlCommand(staffSql, connection, transaction);
                staffCommand.Parameters.AddWithValue("@franchise", franchiseId); staffCommand.Parameters.AddWithValue("@code", code);
                staffCommand.Parameters.AddWithValue("@name", name); staffCommand.Parameters.AddWithValue("@role", NormalizeRole(ReadText(item, "role")));
                staffCommand.Parameters.AddWithValue("@phone", (object?)ReadText(item, "phone") ?? DBNull.Value);
                staffCommand.Parameters.AddWithValue("@email", (object?)ReadText(item, "email") ?? DBNull.Value);
                await staffCommand.ExecuteNonQueryAsync();
            }
        }

        const string completeSql = "UPDATE t_onboarding_draft SET c_is_completed=TRUE,c_current_step=6,c_updated_at=now() WHERE c_user_id=@id;";
        await using var completeCommand = new NpgsqlCommand(completeSql, connection, transaction);
        completeCommand.Parameters.AddWithValue("@id", userId);
        await completeCommand.ExecuteNonQueryAsync();
        await transaction.CommitAsync();
        return true;
    }

    private static string? ReadText(JsonElement root, string name)
    {
        foreach (var property in root.EnumerateObject())
            if (property.Name.Equals(name, StringComparison.OrdinalIgnoreCase) && property.Value.ValueKind == JsonValueKind.String)
                return property.Value.GetString()?.Trim();
        return null;
    }

    private static string ReadObjectJson(JsonElement root, string name)
    {
        foreach (var property in root.EnumerateObject())
            if (property.Name.Equals(name, StringComparison.OrdinalIgnoreCase) && property.Value.ValueKind == JsonValueKind.Object)
                return property.Value.GetRawText();
        return "{}";
    }

    private static JsonElement ReadElement(JsonElement root, string name)
    {
        foreach (var property in root.EnumerateObject())
            if (property.Name.Equals(name, StringComparison.OrdinalIgnoreCase)) return property.Value.Clone();
        using var empty = JsonDocument.Parse("null");
        return empty.RootElement.Clone();
    }

    private static string NormalizeRole(string? role) => role?.Trim() switch
    {
        "Shift Lead" or "Supervisor" => "Shift Supervisor",
        "Senior Cashier" => "Senior Cashier",
        "Store Manager" => "Store Manager",
        "Admin" => "Admin",
        "Barista" => "Barista",
        "Inventory Clerk" => "Inventory Clerk",
        _ => "Cashier"
    };

    private async Task OpenAsync()
    {
        if (connection.State != System.Data.ConnectionState.Open) await connection.OpenAsync();
    }
}
