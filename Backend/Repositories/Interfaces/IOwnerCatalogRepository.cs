using Nurapos.Models;

namespace Nurapos.Repositories.Interfaces;

public interface IOwnerCatalogRepository
{
    Task<List<OwnerCatalogItem>> GetAllAsync(OwnerCatalogType type, int userId);
    Task<OwnerCatalogItem?> GetByIdAsync(OwnerCatalogType type, int id, int userId);
    Task<int> CreateAsync(OwnerCatalogType type, OwnerCatalogItem item, int userId);
    Task<bool> UpdateAsync(OwnerCatalogType type, int id, OwnerCatalogItem item, int userId);
    Task<bool> DeleteAsync(OwnerCatalogType type, int id, int userId);
}
