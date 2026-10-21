using Nurapos.Models;

namespace Nurapos.Repositories.Interfaces;

public interface IOfferRepository
{
    Task EnsureSchemaAsync();
    Task<IReadOnlyList<Offer>> GetAllAsync(int ownerId,int franchiseId);
    Task<Offer> CreateAsync(Offer offer);
    Task<Offer?> GetByCodeAsync(int ownerId,int franchiseId,string code);
}
