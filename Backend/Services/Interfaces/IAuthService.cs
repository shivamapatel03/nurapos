using Nurapos.DTOs.Auth;

namespace Nurapos.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> SignupAsync(SignupRequest request);

    Task<AuthResponse> LoginAsync(LoginRequest request);

    Task SetupPosPinAsync(int userId, string pin);

    Task<PosPinTokenResponse> VerifyPosPinAsync(int userId, string pin);

    Task<AuthResponse> RefreshAsync(string refreshToken);

    Task RevokeRefreshTokenAsync(string refreshToken);
}
