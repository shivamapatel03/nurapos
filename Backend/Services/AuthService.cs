using Nurapos.DTOs.Auth;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;
using Nurapos.Services.Interfaces;
using Nurapos.Helpers;

namespace Nurapos.Services;

public class AuthService : IAuthService
{
    private readonly IAuthRepository _repo;
    private readonly IJwtHelper _jwtHelper;

    public AuthService(IAuthRepository repo, IJwtHelper jwtHelper)
    {
        _repo = repo;
        _jwtHelper = jwtHelper;
    }

    public async Task<AuthResponse> SignupAsync(SignupRequest request)
    {
        // ensure users table
        await _repo.CreateUsersTableIfNotExistsAsync();

        var existing = await _repo.GetByEmailAsync(request.Email);

        if (existing != null)
        {
            throw new InvalidOperationException("Email already registered.");
        }

        var passwordHash = PasswordHelper.HashPassword(request.Password);

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = passwordHash,
            Role = "FRANCHISE_OWNER"
        };

        var userId = await _repo.CreateUserAsync(user);

        var token = _jwtHelper.GenerateToken(userId, user.Email, user.Role);

        return new AuthResponse
        {
            UserId = userId,
            Email = user.Email,
            Token = token,
            CreatedAt = DateTime.UtcNow
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        await _repo.CreateUsersTableIfNotExistsAsync();

        var user = await _repo.GetByEmailAsync(request.Email)
            ?? throw new UnauthorizedAccessException("Invalid credentials.");

        if (!PasswordHelper.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid credentials.");
        }

        var token = _jwtHelper.GenerateToken(user.UserId, user.Email, user.Role);

        return new AuthResponse
        {
            UserId = user.UserId,
            Email = user.Email,
            Token = token,
            CreatedAt = user.CreatedAt
        };
    }
}
