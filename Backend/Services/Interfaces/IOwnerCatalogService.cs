using Nurapos.Models;

namespace Nurapos.Services.Interfaces;

public interface IOwnerCatalogService
{
    Task<List<OwnerCatalogItem>> GetAllAsync(OwnerCatalogType type, int userId);
    Task<OwnerCatalogItem?> GetByIdAsync(OwnerCatalogType type, int id, int userId);
    Task<OwnerCatalogItem> CreateAsync(OwnerCatalogType type, OwnerCatalogItem item, int userId);
    Task<OwnerCatalogItem?> UpdateAsync(OwnerCatalogType type, int id, OwnerCatalogItem item, int userId);
    Task<bool> DeleteAsync(OwnerCatalogType type, int id, int userId);
}
