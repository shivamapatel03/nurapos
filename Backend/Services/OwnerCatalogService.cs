using Nurapos.Models;
using Nurapos.Repositories.Interfaces;
using Nurapos.Services.Interfaces;

namespace Nurapos.Services;

public sealed class OwnerCatalogService : IOwnerCatalogService
{
    private readonly IOwnerCatalogRepository _repository;

    public OwnerCatalogService(IOwnerCatalogRepository repository) => _repository = repository;

    public Task<List<OwnerCatalogItem>> GetAllAsync(OwnerCatalogType type, int userId) =>
        _repository.GetAllAsync(type, userId);

    public Task<OwnerCatalogItem?> GetByIdAsync(OwnerCatalogType type, int id, int userId) =>
        _repository.GetByIdAsync(type, id, userId);

    public async Task<OwnerCatalogItem> CreateAsync(OwnerCatalogType type, OwnerCatalogItem item, int userId)
    {
        ValidateTaxRate(type, item);
        var id = await _repository.CreateAsync(type, item, userId);
        return await _repository.GetByIdAsync(type, id, userId)
            ?? throw new InvalidOperationException("Created item could not be retrieved.");
    }

    public async Task<OwnerCatalogItem?> UpdateAsync(OwnerCatalogType type, int id, OwnerCatalogItem item, int userId)
    {
        ValidateTaxRate(type, item);
        if (!await _repository.UpdateAsync(type, id, item, userId)) return null;
        return await _repository.GetByIdAsync(type, id, userId);
    }

    public Task<bool> DeleteAsync(OwnerCatalogType type, int id, int userId) =>
        _repository.DeleteAsync(type, id, userId);

    private static void ValidateTaxRate(OwnerCatalogType type, OwnerCatalogItem item)
    {
        if (type == OwnerCatalogType.Product && item.TaxRate is not (0m or 5m or 12m or 18m or 28m))
            throw new ArgumentException("Tax rate must be one of 0, 5, 12, 18, or 28 percent.");
    }
}
