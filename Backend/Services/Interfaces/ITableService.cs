using Nurapos.DTOs.Tables;
using Nurapos.Models;

namespace Nurapos.Services.Interfaces;

public interface ITableService
{
    Task<IReadOnlyList<DiningTable>> GetAllAsync(int ownerId, int franchiseId);
    Task<DiningTable> CreateAsync(int ownerId, CreateTableRequest request);
    Task<bool> SetStatusAsync(int ownerId, int id, UpdateTableStatusRequest request);
    Task<bool> TransferAsync(int ownerId, int sourceId, int targetId);
}
