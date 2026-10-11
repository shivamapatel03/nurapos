using Nurapos.DTOs.Auth;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;
using Nurapos.Services.Interfaces;
using Nurapos.Helpers;
using System.Security.Cryptography;
using System.Text;

namespace Nurapos.Services;

public class AuthService : IAuthService
{
    private readonly IAuthRepository _repo;
    private readonly IJwtHelper _jwtHelper;
    private readonly IConfiguration _configuration;

    public AuthService(
        IAuthRepository repo,
        IJwtHelper jwtHelper,
        IConfiguration configuration)
    {
        _repo = repo;
        _jwtHelper = jwtHelper;
        _configuration = configuration;
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

        return await CreateAuthResponseAsync(
            userId, user.Email, user.Role, DateTime.UtcNow);
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

        return await CreateAuthResponseAsync(
            user.UserId, user.Email, user.Role, user.CreatedAt);
    }

    public async Task SetupPosPinAsync(int userId, string pin)
    {
        await _repo.CreateUsersTableIfNotExistsAsync();
        if (!await _repo.SetPosPinHashAsync(userId, PasswordHelper.HashPassword(pin)))
        {
            throw new InvalidOperationException("A POS PIN is already configured for this account.");
        }
    }

    public async Task<PosPinTokenResponse> VerifyPosPinAsync(int userId, string pin)
    {
        await _repo.CreateUsersTableIfNotExistsAsync();
        var pinHash = await _repo.GetPosPinHashAsync(userId);
        if (pinHash == null)
        {
            throw new InvalidOperationException("Set up a POS PIN before verifying it.");
        }

        if (!PasswordHelper.Verify(pin, pinHash))
        {
            throw new UnauthorizedAccessException("Invalid POS PIN.");
        }

        var user = await _repo.GetByIdAsync(userId)
            ?? throw new UnauthorizedAccessException("The authenticated account was not found.");
        var token = _jwtHelper.GenerateToken(user.UserId, user.Email, user.Role, posPinVerified: true);
        return new PosPinTokenResponse
        {
            AccessToken = token.Token,
            AccessTokenExpiresAtUtc = token.ExpiresAtUtc
        };
    }

    public async Task<AuthResponse> RefreshAsync(string refreshToken)
    {
        await _repo.CreateUsersTableIfNotExistsAsync();

        if (string.IsNullOrWhiteSpace(refreshToken))
        {
            throw new UnauthorizedAccessException("Invalid refresh token.");
        }

        var replacementRefreshToken = CreateRefreshToken();
        var refreshExpiresAtUtc = GetRefreshTokenExpiry();
        var user = await _repo.RotateRefreshTokenAsync(
            HashRefreshToken(refreshToken),
            HashRefreshToken(replacementRefreshToken),
            refreshExpiresAtUtc);

        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid or expired refresh token.");
        }

        var accessToken = _jwtHelper.GenerateToken(user.UserId, user.Email, user.Role);
        var hasPosPin = await _repo.HasPosPinAsync(user.UserId);
        return new AuthResponse
        {
            UserId = user.UserId,
            Email = user.Email,
            Token = accessToken.Token,
            AccessToken = accessToken.Token,
            RefreshToken = replacementRefreshToken,
            AccessTokenExpiresAtUtc = accessToken.ExpiresAtUtc,
            RefreshTokenExpiresAtUtc = refreshExpiresAtUtc,
            CreatedAt = user.CreatedAt,
            PosPinConfigured = hasPosPin
        };
    }

    public async Task RevokeRefreshTokenAsync(string refreshToken)
    {
        await _repo.CreateUsersTableIfNotExistsAsync();
        if (!string.IsNullOrWhiteSpace(refreshToken))
        {
            await _repo.RevokeRefreshTokenAsync(HashRefreshToken(refreshToken));
        }
    }

    private async Task<AuthResponse> CreateAuthResponseAsync(
        int userId,
        string email,
        string role,
        DateTime createdAt)
    {
        var accessToken = _jwtHelper.GenerateToken(userId, email, role);
        var refreshToken = CreateRefreshToken();
        var refreshTokenExpiresAtUtc = GetRefreshTokenExpiry();

        await _repo.StoreRefreshTokenAsync(
            userId,
            HashRefreshToken(refreshToken),
            refreshTokenExpiresAtUtc);

        var hasPosPin = await _repo.HasPosPinAsync(userId);
        return new AuthResponse
        {
            UserId = userId,
            Email = email,
            Token = accessToken.Token,
            AccessToken = accessToken.Token,
            RefreshToken = refreshToken,
            AccessTokenExpiresAtUtc = accessToken.ExpiresAtUtc,
            RefreshTokenExpiresAtUtc = refreshTokenExpiresAtUtc,
            CreatedAt = createdAt,
            PosPinConfigured = hasPosPin
        };
    }

    private DateTime GetRefreshTokenExpiry()
    {
        var refreshDays = _configuration.GetValue("Jwt:RefreshTokenExpiryDays", 30);
        return DateTime.UtcNow.AddDays(refreshDays);
    }

    private static string CreateRefreshToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64))
            .Replace('+', '-')
            .Replace('/', '_')
            .TrimEnd('=');
    }

    private static string HashRefreshToken(string refreshToken)
    {
        return Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(refreshToken)));
    }
}
