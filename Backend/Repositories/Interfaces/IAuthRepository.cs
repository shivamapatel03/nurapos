using Nurapos.Models;

namespace Nurapos.Repositories.Interfaces;

public interface IAuthRepository
{
    Task CreateUsersTableIfNotExistsAsync();

    Task<int> CreateUserAsync(User user);

    Task<User?> GetByEmailAsync(string email);
}
