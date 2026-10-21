using Nurapos.DTOs.Customers;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;
using Nurapos.Services.Interfaces;

namespace Nurapos.Services;

public sealed class CustomerService(ICustomerRepository repository) : ICustomerService
{
    public Task<IReadOnlyList<Customer>> GetAllAsync(int ownerId, string? search, string? name) =>
        repository.GetAllAsync(ownerId, search?.Trim(), name?.Trim());

    public Task<Customer> CreateAsync(int ownerId, CreateCustomerRequest request) => repository.CreateAsync(new Customer
    {
        OwnerId = ownerId, Name = request.Name.Trim(), Phone = request.Phone.Trim(),
        Email = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim().ToLowerInvariant(),
        Address = string.IsNullOrWhiteSpace(request.Address) ? null : request.Address.Trim()
    });

    public Task<LoyaltyRedemption?> RedeemAsync(int ownerId, int customerId, LoyaltyRedeemRequest request) =>
        repository.RedeemAsync(ownerId, customerId, request.Points, request.SaleSubtotal);
}
