using Nurapos.Models;

namespace Nurapos.Repositories.Interfaces;

public interface IAuthRepository
{
    Task CreateUsersTableIfNotExistsAsync();

    Task<int> CreateUserAsync(User user);

    Task<User?> GetByEmailAsync(string email);

    Task<User?> GetByIdAsync(int userId);

    Task<bool> HasPosPinAsync(int userId);

    Task<bool> SetPosPinHashAsync(int userId, string pinHash);

    Task<string?> GetPosPinHashAsync(int userId);

    Task StoreRefreshTokenAsync(int userId, string tokenHash, DateTime expiresAtUtc);

    Task<User?> RotateRefreshTokenAsync(
        string currentTokenHash,
        string replacementTokenHash,
        DateTime replacementExpiresAtUtc);

    Task<bool> RevokeRefreshTokenAsync(string tokenHash);
}
