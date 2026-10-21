using Nurapos.DTOs.Tables;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;
using Nurapos.Services.Interfaces;

namespace Nurapos.Services;

public sealed class TableService(ITableRepository repository) : ITableService
{
    public Task<IReadOnlyList<DiningTable>> GetAllAsync(int ownerId, int franchiseId) => repository.GetAllAsync(ownerId, franchiseId);
    public Task<DiningTable> CreateAsync(int ownerId, CreateTableRequest request) => repository.CreateAsync(new DiningTable
    {
        FranchiseId=request.FranchiseId,TableNumber=request.TableNumber.Trim(),Section=request.Section.Trim(),Capacity=request.Capacity
    }, ownerId);
    public Task<bool> SetStatusAsync(int ownerId, int id, UpdateTableStatusRequest request) =>
        repository.SetStatusAsync(ownerId,id,request.Status,request.ActiveOrderId);
    public Task<bool> TransferAsync(int ownerId, int sourceId, int targetId) => repository.TransferAsync(ownerId,sourceId,targetId);
}
