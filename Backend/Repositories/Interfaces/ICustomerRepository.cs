using Nurapos.Models;

namespace Nurapos.Repositories.Interfaces;

public interface ICustomerRepository
{
    Task EnsureSchemaAsync();
    Task<IReadOnlyList<Customer>> GetAllAsync(int ownerId, string? search, string? name);
    Task<Customer> CreateAsync(Customer customer);
    Task<LoyaltyRedemption?> RedeemAsync(int ownerId, int customerId, int points, decimal saleSubtotal);
}

public sealed record LoyaltyRedemption(decimal DiscountAmount, int RemainingPoints);
