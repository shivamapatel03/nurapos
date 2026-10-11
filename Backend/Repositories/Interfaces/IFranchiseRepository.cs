using Nurapos.Models;

namespace Nurapos.Repositories.Interfaces;

public interface IFranchiseRepository
{
    Task<int> CreateAsync(Franchise franchise);

    Task<List<Franchise>> GetAllAsync(int userId);

    Task<Franchise?> GetByIdAsync(int franchiseId, int userId);

    Task<bool> UpdateAsync(Franchise franchise, int userId);

    Task<bool> DeleteAsync(int franchiseId, int userId);

    Task<bool> ExistsAsync(int franchiseId, int userId);

    Task EnsureFranchiseSchemaAsync();

}
