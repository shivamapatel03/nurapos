namespace Nurapos.DTOs.Auth;

public class AuthResponse
{
    public int UserId { get; set; }

    public string Email { get; set; } = string.Empty;

    // Token remains as a compatibility alias for existing API consumers.
    public string Token { get; set; } = string.Empty;

    public string AccessToken { get; set; } = string.Empty;

    public string RefreshToken { get; set; } = string.Empty;

    public DateTime AccessTokenExpiresAtUtc { get; set; }

    public DateTime RefreshTokenExpiresAtUtc { get; set; }

    public DateTime CreatedAt { get; set; }

    public bool PosPinConfigured { get; set; }
}
