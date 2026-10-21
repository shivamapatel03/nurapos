namespace Nurapos.DTOs.Auth;

public sealed class RegisterResponse
{
    public string VerificationId { get; init; } = string.Empty;
    public DateTime ExpiresAtUtc { get; init; }
}
