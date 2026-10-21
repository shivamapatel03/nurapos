using System.ComponentModel.DataAnnotations;

namespace Nurapos.DTOs.Customers;

public sealed class CreateCustomerRequest
{
    [Required, StringLength(120, MinimumLength = 2)] public string Name { get; set; } = string.Empty;
    [Required, Phone, StringLength(32)] public string Phone { get; set; } = string.Empty;
    [EmailAddress, StringLength(100)] public string? Email { get; set; }
    [StringLength(500)] public string? Address { get; set; }
}

public sealed class LoyaltyRedeemRequest
{
    [Range(1, 1000000)] public int Points { get; set; }
    [Range(typeof(decimal), "0.01", "999999999.99")] public decimal SaleSubtotal { get; set; }
}

public sealed class LoyaltyRedeemResponse
{
    public decimal DiscountAmount { get; init; }
    public int RemainingPoints { get; init; }
}
