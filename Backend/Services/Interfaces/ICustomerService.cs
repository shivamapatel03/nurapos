using Nurapos.DTOs.Customers;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;

namespace Nurapos.Services.Interfaces;

public interface ICustomerService
{
    Task<IReadOnlyList<Customer>> GetAllAsync(int ownerId, string? search, string? name);
    Task<Customer> CreateAsync(int ownerId, CreateCustomerRequest request);
    Task<LoyaltyRedemption?> RedeemAsync(int ownerId, int customerId, LoyaltyRedeemRequest request);
}
