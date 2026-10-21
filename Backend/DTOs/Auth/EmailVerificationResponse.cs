namespace Nurapos.DTOs.Auth;

public sealed class EmailVerificationResponse
{
    public bool IsVerified { get; init; }
    public AuthResponse? Session { get; init; }
}
