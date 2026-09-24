using Nurapos.Models;

namespace Nurapos.Repositories.Interfaces;

public interface IFranchiseRepository
{
    Task<int> CreateAsync(Franchise franchise);

    Task<List<Franchise>> GetAllAsync();

    Task<Franchise?> GetByIdAsync(int franchiseId);

    Task<bool> UpdateAsync(Franchise franchise);

    Task<bool> DeleteAsync(int franchiseId);

    Task<bool> ExistsAsync(int franchiseId);

    Task<bool> EmailExistsAsync(
        string email,
        int? excludeFranchiseId = null
    );
}