using Nurapos.Services.Interfaces;

namespace Nurapos.Services;

public sealed class UnconfiguredOtpStore : IOtpStore
{
    private static InvalidOperationException Missing() => new("Redis:ConnectionString must be configured to use OTP and password recovery endpoints.");
    public Task PutAsync(string purpose, string normalizedEmail, string codeHash, TimeSpan lifetime, string? transactionId = null) => Task.FromException(Missing());
    public Task<OtpValidationResult> VerifyAsync(string purpose, string normalizedEmail, string codeHash, int maxAttempts, string? transactionId = null) => Task.FromException<OtpValidationResult>(Missing());
    public Task DeleteAsync(string purpose, string normalizedEmail) => Task.FromException(Missing());
    public Task PutTokenAsync(string purpose, string tokenHash, string email, TimeSpan lifetime) => Task.FromException(Missing());
    public Task<string?> ConsumeTokenAsync(string purpose, string tokenHash) => Task.FromException<string?>(Missing());
}
