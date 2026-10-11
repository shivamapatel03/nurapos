namespace Nurapos.DTOs.Auth;

public sealed class PosPinTokenResponse
{
    public string AccessToken { get; init; } = string.Empty;
    public DateTime AccessTokenExpiresAtUtc { get; init; }
    public string TokenType { get; init; } = "Bearer";
}
