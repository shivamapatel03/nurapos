namespace Nurapos.Services.Interfaces;

public enum OtpValidationResult { Valid, MissingOrExpired, AttemptsExceeded, Invalid }

public interface IOtpStore
{
    Task PutAsync(string purpose, string normalizedEmail, string codeHash, TimeSpan lifetime, string? transactionId = null);
    Task<OtpValidationResult> VerifyAsync(string purpose, string normalizedEmail, string codeHash, int maxAttempts, string? transactionId = null);
    Task DeleteAsync(string purpose, string normalizedEmail);
    Task PutTokenAsync(string purpose, string tokenHash, string email, TimeSpan lifetime);
    Task<string?> ConsumeTokenAsync(string purpose, string tokenHash);
}
