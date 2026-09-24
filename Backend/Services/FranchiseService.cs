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
        CreateFranchiseRequest request)
    {
        var franchiseName = request.FranchiseName.Trim();

        string? email = string.IsNullOrWhiteSpace(request.Email)
            ? null
            : request.Email.Trim().ToLowerInvariant();

        if (email != null)
        {
            var emailExists =
                await _repository.EmailExistsAsync(email);

            if (emailExists)
            {
                throw new InvalidOperationException(
                    "A franchise with this email already exists."
                );
            }
        }

        var franchise = new Franchise
        {
            FranchiseName = franchiseName,

            OwnerName = string.IsNullOrWhiteSpace(request.OwnerName)
                ? null
                : request.OwnerName.Trim(),

            Contact = string.IsNullOrWhiteSpace(request.Contact)
                ? null
                : request.Contact.Trim(),

            Email = email,

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
            await _repository.GetByIdAsync(franchiseId);

        if (createdFranchise == null)
        {
            throw new InvalidOperationException(
                "Franchise was created but could not be retrieved."
            );
        }

        return MapResponse(createdFranchise);
    }

    public async Task<List<FranchiseResponse>> GetAllAsync()
    {
        var franchises =
            await _repository.GetAllAsync();

        return franchises
            .Select(MapResponse)
            .ToList();
    }

    public async Task<FranchiseResponse?> GetByIdAsync(
        int franchiseId)
    {
        ValidateId(franchiseId);

        var franchise =
            await _repository.GetByIdAsync(franchiseId);

        return franchise == null
            ? null
            : MapResponse(franchise);
    }

    public async Task<FranchiseResponse> UpdateAsync(
        int franchiseId,
        UpdateFranchiseRequest request)
    {
        ValidateId(franchiseId);

        var existing =
            await _repository.GetByIdAsync(franchiseId);

        if (existing == null)
        {
            throw new KeyNotFoundException(
                "Franchise not found."
            );
        }

        string? email = string.IsNullOrWhiteSpace(request.Email)
            ? null
            : request.Email.Trim().ToLowerInvariant();

        if (email != null)
        {
            var emailExists =
                await _repository.EmailExistsAsync(
                    email,
                    franchiseId
                );

            if (emailExists)
            {
                throw new InvalidOperationException(
                    "Another franchise with this email already exists."
                );
            }
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

        existing.Email = email;

        existing.Address =
            string.IsNullOrWhiteSpace(request.Address)
                ? null
                : request.Address.Trim();

        existing.City =
            string.IsNullOrWhiteSpace(request.City)
                ? null
                : request.City.Trim();

        existing.Status =
            request.Status.Trim().ToUpperInvariant();

        var updated =
            await _repository.UpdateAsync(existing);

        if (!updated)
        {
            throw new InvalidOperationException(
                "Franchise could not be updated."
            );
        }

        var updatedFranchise =
            await _repository.GetByIdAsync(franchiseId);

        if (updatedFranchise == null)
        {
            throw new InvalidOperationException(
                "Updated franchise could not be retrieved."
            );
        }

        return MapResponse(updatedFranchise);
    }

    public async Task DeleteAsync(int franchiseId)
    {
        ValidateId(franchiseId);

        var exists =
            await _repository.ExistsAsync(franchiseId);

        if (!exists)
        {
            throw new KeyNotFoundException(
                "Franchise not found."
            );
        }

        await _repository.DeleteAsync(franchiseId);
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
            Email = franchise.Email,
            Address = franchise.Address,
            City = franchise.City,
            Status = franchise.Status,
            CreatedAt = franchise.CreatedAt
        };
    }
}