using Nurapos.DTOs.Franchise;

namespace Nurapos.Services.Interfaces;

public interface IFranchiseService
{
    Task<FranchiseResponse> CreateAsync(
        CreateFranchiseRequest request,
        int userId
    );

    Task<List<FranchiseResponse>> GetAllAsync(int userId);

    Task<FranchiseResponse?> GetByIdAsync(
        int franchiseId,
        int userId
    );

    Task<FranchiseResponse> UpdateAsync(
        int franchiseId,
        UpdateFranchiseRequest request,
        int userId
    );

    Task DeleteAsync(int franchiseId, int userId);
}
