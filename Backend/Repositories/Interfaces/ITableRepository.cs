using Nurapos.Models;

namespace Nurapos.Repositories.Interfaces;

public interface ITableRepository
{
    Task EnsureSchemaAsync();
    Task<IReadOnlyList<DiningTable>> GetAllAsync(int ownerId, int franchiseId);
    Task<DiningTable> CreateAsync(DiningTable table, int ownerId);
    Task<bool> SetStatusAsync(int ownerId, int tableId, string status, string? activeOrderId);
    Task<bool> TransferAsync(int ownerId, int sourceTableId, int targetTableId);
}
