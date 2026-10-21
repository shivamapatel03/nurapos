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
    private readonly IOtpStore _otpStore;
    private readonly IEmailSender _emailSender;

    public AuthService(
        IAuthRepository repo,
        IJwtHelper jwtHelper,
        IConfiguration configuration,
        IOtpStore otpStore,
        IEmailSender emailSender)
    {
        _repo = repo;
        _jwtHelper = jwtHelper;
        _configuration = configuration;
        _otpStore = otpStore;
        _emailSender = emailSender;
    }

    public async Task<RegisterResponse> RegisterAsync(SignupRequest request)
    {
        EnsureOtpDeliveryConfigured();
        await _repo.CreateUsersTableIfNotExistsAsync();
        var email = NormalizeEmail(request.Email);
        if (await _repo.GetByEmailAsync(email) != null)
            throw new InvalidOperationException("Email already registered.");

        var user = new User
        {
            Name = request.Name.Trim(), Email = email,
            PasswordHash = PasswordHelper.HashPassword(request.Password),
            Role = "FRANCHISE_OWNER", IsVerified = false
        };
        await _repo.CreateUserAsync(user);
        var verificationId = await IssueOtpAsync("verify", email, "Verify your Nurapos email", "email verification");
        return new RegisterResponse
        {
            VerificationId = verificationId,
            ExpiresAtUtc = DateTime.UtcNow.AddMinutes(OtpTtlMinutes)
        };
    }

    public async Task<AuthResponse?> VerifyEmailAsync(EmailCodeRequest request)
    {
        await _repo.CreateUsersTableIfNotExistsAsync();
        var email = NormalizeEmail(request.Email);
        var user = await _repo.GetByEmailAsync(email) ?? throw new KeyNotFoundException("Email is not registered.");
        if (user.IsVerified) return null;
        var result = await _otpStore.VerifyAsync("verify", email, HashOtp("verify", email, request.Code), MaxOtpAttempts, request.VerificationId);
        EnsureOtpAccepted(result);
        await _repo.SetEmailVerifiedAsync(user.UserId);
        return await CreateAuthResponseAsync(user.UserId,user.Email,user.Role,user.CreatedAt);
    }

    public async Task ResendVerificationAsync(EmailRequest request)
    {
        EnsureOtpDeliveryConfigured();
        var email = NormalizeEmail(request.Email);
        var user = await _repo.GetByEmailAsync(email);
        if (user is not null && !user.IsVerified)
            _ = await IssueOtpAsync("verify", email, "Your Nurapos verification code", "email verification");
    }

    public async Task ForgotPasswordAsync(EmailRequest request)
    {
        EnsureOtpDeliveryConfigured();
        var email = NormalizeEmail(request.Email);
        var user = await _repo.GetByEmailAsync(email);
        if (user is not null)
            _ = await IssueOtpAsync("reset", email, "Your Nurapos password reset code", "password reset");
    }

    public async Task<string> VerifyPasswordResetCodeAsync(EmailCodeRequest request)
    {
        var email = NormalizeEmail(request.Email);
        var result = await _otpStore.VerifyAsync("reset", email, HashOtp("reset", email, request.Code), MaxOtpAttempts);
        EnsureOtpAccepted(result);
        var token = CreateRefreshToken();
        var tokenHash = HashRefreshToken(token);
        await _otpStore.PutTokenAsync("reset", tokenHash, email, TimeSpan.FromMinutes(10));
        return token;
    }

    public async Task ResetPasswordAsync(PasswordResetRequest request)
    {
        var email = NormalizeEmail(request.Email);
        var tokenEmail = await _otpStore.ConsumeTokenAsync("reset", HashRefreshToken(request.ResetToken));
        if (!string.Equals(tokenEmail, email, StringComparison.Ordinal))
            throw new UnauthorizedAccessException("Reset token is invalid or expired.");
        var user = await _repo.GetByEmailAsync(email)
            ?? throw new UnauthorizedAccessException("Reset token is invalid or expired.");
        if (!await _repo.UpdatePasswordAndRevokeRefreshTokensAsync(user.UserId, PasswordHelper.HashPassword(request.NewPassword)))
            throw new InvalidOperationException("Password could not be updated.");
    }

    private int OtpTtlMinutes => Math.Clamp(_configuration.GetValue("Redis:OtpTtlMinutes", 10), 1, 30);
    private int MaxOtpAttempts => Math.Clamp(_configuration.GetValue("Redis:MaxOtpAttempts", 5), 1, 10);

    private async Task<string> IssueOtpAsync(string purpose, string email, string subject, string label)
    {
        var code = RandomNumberGenerator.GetInt32(0, 10000).ToString("D4");
        var transactionId = purpose == "verify" ? Convert.ToHexString(RandomNumberGenerator.GetBytes(16)).ToLowerInvariant() : null;
        await _otpStore.PutAsync(purpose, email, HashOtp(purpose, email, code), TimeSpan.FromMinutes(OtpTtlMinutes), transactionId);
        var safeCode = System.Net.WebUtility.HtmlEncode(code);
        await _emailSender.SendAsync(email, subject,
            $"<p>Your {label} code is <strong>{safeCode}</strong>.</p><p>It expires in {OtpTtlMinutes} minutes.</p>");
        return transactionId ?? string.Empty;
    }

    private void EnsureOtpDeliveryConfigured()
    {
        if (string.IsNullOrWhiteSpace(_configuration["Redis:ConnectionString"]))
            throw new InvalidOperationException("Redis:ConnectionString must be configured before account verification can be used.");
        if (string.IsNullOrWhiteSpace(_configuration["Mail:Host"]) || string.IsNullOrWhiteSpace(_configuration["Mail:FromAddress"]))
            throw new InvalidOperationException("Mail:Host and Mail:FromAddress must be configured before account verification can be used.");
        _ = HashOtp("configuration-check", "configuration-check", "0000");
    }

    private string HashOtp(string purpose, string email, string code)
    {
        var pepper = _configuration["Auth:OtpPepper"] ?? _configuration["Jwt:Key"];
        if (string.IsNullOrWhiteSpace(pepper) || pepper == "YOUR_VERY_LONG_RANDOM_SECRET_KEY_HERE")
            throw new InvalidOperationException("Configure Auth:OtpPepper using a secret value.");
        var bytes = System.Security.Cryptography.HMACSHA256.HashData(Encoding.UTF8.GetBytes(pepper), Encoding.UTF8.GetBytes($"{purpose}:{email}:{code}"));
        return Convert.ToHexString(bytes);
    }

    private static string NormalizeEmail(string email) => email.Trim().ToLowerInvariant();

    private static void EnsureOtpAccepted(OtpValidationResult result)
    {
        if (result == OtpValidationResult.Valid) return;
        if (result is OtpValidationResult.MissingOrExpired or OtpValidationResult.AttemptsExceeded)
            throw new InvalidOperationException(result == OtpValidationResult.MissingOrExpired ? "Code expired." : "Maximum verification attempts exceeded.");
        throw new UnauthorizedAccessException("Invalid verification code.");
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

        if (!user.IsVerified)
            throw new UnauthorizedAccessException("Verify your email before signing in.");

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
