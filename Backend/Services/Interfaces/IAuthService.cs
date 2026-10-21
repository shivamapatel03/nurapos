using Nurapos.DTOs.Auth;

namespace Nurapos.Services.Interfaces;

public interface IAuthService
{
    Task<RegisterResponse> RegisterAsync(SignupRequest request);
    Task<AuthResponse?> VerifyEmailAsync(EmailCodeRequest request);
    Task ResendVerificationAsync(EmailRequest request);
    Task ForgotPasswordAsync(EmailRequest request);
    Task<string> VerifyPasswordResetCodeAsync(EmailCodeRequest request);
    Task ResetPasswordAsync(PasswordResetRequest request);

    Task<AuthResponse> SignupAsync(SignupRequest request);

    Task<AuthResponse> LoginAsync(LoginRequest request);

    Task SetupPosPinAsync(int userId, string pin);

    Task<PosPinTokenResponse> VerifyPosPinAsync(int userId, string pin);

    Task<AuthResponse> RefreshAsync(string refreshToken);

    Task RevokeRefreshTokenAsync(string refreshToken);
}
