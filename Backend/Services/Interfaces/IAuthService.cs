using Nurapos.DTOs.Auth;

namespace Nurapos.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> SignupAsync(SignupRequest request);

    Task<AuthResponse> LoginAsync(LoginRequest request);
}
