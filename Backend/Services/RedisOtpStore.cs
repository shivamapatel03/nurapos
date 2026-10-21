using StackExchange.Redis;
using Nurapos.Services.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace Nurapos.Services;

public sealed class RedisOtpStore(IConnectionMultiplexer redis) : IOtpStore
{
    private readonly IDatabase _database = redis.GetDatabase();

    public async Task PutAsync(string purpose, string normalizedEmail, string codeHash, TimeSpan lifetime, string? transactionId = null)
    {
        var key = OtpKey(purpose, normalizedEmail);
        var entries = new HashEntry[] { new("hash", codeHash), new("attempts", 0), new("transaction_id", transactionId ?? string.Empty) };
        await _database.HashSetAsync(key, entries);
        await _database.KeyExpireAsync(key, lifetime);
    }

    public async Task<OtpValidationResult> VerifyAsync(string purpose, string normalizedEmail, string codeHash, int maxAttempts, string? transactionId = null)
    {
        const string script = """
            local key = KEYS[1]
            if redis.call('EXISTS', key) == 0 then return -1 end
            local attempts = tonumber(redis.call('HGET', key, 'attempts') or '0')
            if attempts >= tonumber(ARGV[2]) then return -2 end
            local expected = redis.call('HGET', key, 'hash')
            local expectedId = redis.call('HGET', key, 'transaction_id') or ''
            if ARGV[3] ~= '' and expectedId ~= ARGV[3] then
                attempts = redis.call('HINCRBY', key, 'attempts', 1)
                if attempts >= tonumber(ARGV[2]) then return -2 end
                return 0
            end
            if expected == ARGV[1] then redis.call('DEL', key); return 1 end
            attempts = redis.call('HINCRBY', key, 'attempts', 1)
            if attempts >= tonumber(ARGV[2]) then return -2 end
            return 0
            """;
        var result = (int)await _database.ScriptEvaluateAsync(script,
            [OtpKey(purpose, normalizedEmail)], [codeHash, maxAttempts, transactionId ?? string.Empty]);
        return result switch
        {
            1 => OtpValidationResult.Valid,
            -1 => OtpValidationResult.MissingOrExpired,
            -2 => OtpValidationResult.AttemptsExceeded,
            _ => OtpValidationResult.Invalid
        };
    }

    public Task DeleteAsync(string purpose, string normalizedEmail) =>
        _database.KeyDeleteAsync(OtpKey(purpose, normalizedEmail));

    public async Task PutTokenAsync(string purpose, string tokenHash, string email, TimeSpan lifetime) =>
        await _database.StringSetAsync($"nurapos:{purpose}:token:{tokenHash}", email, lifetime);

    public async Task<string?> ConsumeTokenAsync(string purpose, string tokenHash)
    {
        const string script = "local v=redis.call('GET', KEYS[1]); if v then redis.call('DEL', KEYS[1]); end; return v";
        var value = await _database.ScriptEvaluateAsync(script, [$"nurapos:{purpose}:token:{tokenHash}"]);
        return value.IsNull ? null : (string?)value;
    }

    private static RedisKey OtpKey(string purpose, string email)
    {
        var emailHash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(email))).ToLowerInvariant();
        return $"nurapos:otp:{purpose}:{emailHash}";
    }
}
