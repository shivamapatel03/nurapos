using Nurapos.DTOs.Offers;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;
using Nurapos.Services.Interfaces;

namespace Nurapos.Services;

public sealed class OfferService(IOfferRepository repository) : IOfferService
{
    public Task<IReadOnlyList<Offer>> GetAllAsync(int ownerId,int franchiseId)=>repository.GetAllAsync(ownerId,franchiseId);

    public Task<Offer> CreateAsync(int ownerId,CreateOfferRequest request)
    {
        if(request.EndDate<request.StartDate) throw new ArgumentException("End date must be on or after start date.");
        if(request.DiscountType=="percentage"&&request.DiscountValue>100) throw new ArgumentException("Percentage discounts cannot exceed 100.");
        if(request.AppliesTo!="all"&&request.TargetIds.Count==0) throw new ArgumentException("Target IDs are required for category or product offers.");
        return repository.CreateAsync(new Offer
        {
            OwnerId=ownerId,FranchiseId=request.FranchiseId,Title=request.Title.Trim(),Code=request.BadgeText.Trim().ToUpperInvariant(),
            DiscountType=request.DiscountType,DiscountValue=request.DiscountValue,AppliesTo=request.AppliesTo,
            TargetIds=request.TargetIds.Distinct().ToArray(),MinSubtotal=request.MinSubtotal,StartDate=request.StartDate,
            EndDate=request.EndDate,IsActive=request.IsActive
        });
    }

    public async Task<DiscountValidationResponse> ValidateCodeAsync(int ownerId,ValidateDiscountCodeRequest request)
    {
        var offer=await repository.GetByCodeAsync(ownerId,request.FranchiseId,request.Code.Trim());
        if(offer is null) return new DiscountValidationResponse{IsValid=false,Reason="Code is invalid or inactive."};
        if(request.Subtotal<offer.MinSubtotal) return new DiscountValidationResponse{IsValid=false,Code=offer.Code,Reason=$"Minimum subtotal is {offer.MinSubtotal:0.00}."};
        var discount=offer.DiscountType switch
        {
            "percentage"=>decimal.Round(request.Subtotal*offer.DiscountValue/100m,2,MidpointRounding.AwayFromZero),
            "fixed_amount"=>Math.Min(request.Subtotal,offer.DiscountValue),
            _=>0m
        };
        return new DiscountValidationResponse{IsValid=true,Code=offer.Code,DiscountAmount=discount,
            Reason=offer.DiscountType=="promo_price"?"Product-specific price is applied when matching order items are quoted.":null};
    }
}
