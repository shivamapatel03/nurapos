using Nurapos.DTOs.Franchise;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;
using Nurapos.Services.Interfaces;

namespace Nurapos.Services;

public class FranchiseService : IFranchiseService
{
    private readonly IFranchiseRepository _repository;

    public FranchiseService(IFranchiseRepository repository)
    {
        _repository = repository;
    }

    public async Task<FranchiseResponse> CreateAsync(
        CreateFranchiseRequest request,
        int userId)
    {
        var franchiseName = request.FranchiseName.Trim();

        var franchise = new Franchise
        {
            UserId = userId,
            FranchiseName = franchiseName,

            OwnerName = string.IsNullOrWhiteSpace(request.OwnerName)
                ? null
                : request.OwnerName.Trim(),

            Contact = string.IsNullOrWhiteSpace(request.Contact)
                ? null
                : request.Contact.Trim(),

            Address = string.IsNullOrWhiteSpace(request.Address)
                ? null
                : request.Address.Trim(),

            City = string.IsNullOrWhiteSpace(request.City)
                ? null
                : request.City.Trim(),

            Status = "ACTIVE"
        };

        var franchiseId =
            await _repository.CreateAsync(franchise);

        var createdFranchise =
            await _repository.GetByIdAsync(franchiseId, userId);

        if (createdFranchise == null)
        {
            throw new InvalidOperationException(
                "Franchise was created but could not be retrieved."
            );
        }

        return MapResponse(createdFranchise);
    }

    public async Task<List<FranchiseResponse>> GetAllAsync(int userId)
    {
        var franchises =
            await _repository.GetAllAsync(userId);

        return franchises
            .Select(MapResponse)
            .ToList();
    }

    public async Task<FranchiseResponse?> GetByIdAsync(
        int franchiseId,
        int userId)
    {
        ValidateId(franchiseId);

        var franchise =
            await _repository.GetByIdAsync(franchiseId, userId);

        return franchise == null
            ? null
            : MapResponse(franchise);
    }

    public async Task<FranchiseResponse> UpdateAsync(
        int franchiseId,
        UpdateFranchiseRequest request,
        int userId)
    {
        ValidateId(franchiseId);

        var existing =
            await _repository.GetByIdAsync(franchiseId, userId);

        if (existing == null)
        {
            throw new KeyNotFoundException(
                "Franchise not found."
            );
        }

        existing.FranchiseName =
            request.FranchiseName.Trim();

        existing.OwnerName =
            string.IsNullOrWhiteSpace(request.OwnerName)
                ? null
                : request.OwnerName.Trim();

        existing.Contact =
            string.IsNullOrWhiteSpace(request.Contact)
                ? null
                : request.Contact.Trim();

        existing.Address =
            string.IsNullOrWhiteSpace(request.Address)
                ? null
                : request.Address.Trim();

        existing.City =
            string.IsNullOrWhiteSpace(request.City)
                ? null
                : request.City.Trim();

        existing.Status = request.Status.Trim().ToUpperInvariant();

        var updated =
            await _repository.UpdateAsync(existing, userId);

        if (!updated)
        {
            throw new InvalidOperationException(
                "Franchise could not be updated."
            );
        }

        var updatedFranchise =
            await _repository.GetByIdAsync(franchiseId, userId);

        if (updatedFranchise == null)
        {
            throw new InvalidOperationException(
                "Updated franchise could not be retrieved."
            );
        }

        return MapResponse(updatedFranchise);
    }

    public async Task DeleteAsync(int franchiseId, int userId)
    {
        ValidateId(franchiseId);

        var exists =
            await _repository.ExistsAsync(franchiseId, userId);

        if (!exists)
        {
            throw new KeyNotFoundException(
                "Franchise not found."
            );
        }

        await _repository.DeleteAsync(franchiseId, userId);
    }

    private static void ValidateId(int franchiseId)
    {
        if (franchiseId <= 0)
        {
            throw new ArgumentException(
                "Franchise ID must be greater than zero."
            );
        }
    }

    private static FranchiseResponse MapResponse(
        Franchise franchise)
    {
        return new FranchiseResponse
        {
            FranchiseId = franchise.FranchiseId,
            FranchiseName = franchise.FranchiseName,
            OwnerName = franchise.OwnerName,
            Contact = franchise.Contact,
            Address = franchise.Address,
            City = franchise.City,
            Status = franchise.Status,
            CreatedAt = franchise.CreatedAt
        };
    }
}
