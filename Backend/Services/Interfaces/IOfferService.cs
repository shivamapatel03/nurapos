using Nurapos.DTOs.Offers;
using Nurapos.Models;

namespace Nurapos.Services.Interfaces;

public interface IOfferService
{
    Task<IReadOnlyList<Offer>> GetAllAsync(int ownerId,int franchiseId);
    Task<Offer> CreateAsync(int ownerId,CreateOfferRequest request);
    Task<DiscountValidationResponse> ValidateCodeAsync(int ownerId,ValidateDiscountCodeRequest request);
}
