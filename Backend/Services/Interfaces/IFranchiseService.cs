using Nurapos.DTOs.Franchise;

namespace Nurapos.Services.Interfaces;

public interface IFranchiseService
{
    Task<FranchiseResponse> CreateAsync(
        CreateFranchiseRequest request
    );

    Task<List<FranchiseResponse>> GetAllAsync();

    Task<FranchiseResponse?> GetByIdAsync(
        int franchiseId
    );

    Task<FranchiseResponse> UpdateAsync(
        int franchiseId,
        UpdateFranchiseRequest request
    );

    Task DeleteAsync(int franchiseId);
}