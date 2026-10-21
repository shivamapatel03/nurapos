namespace Nurapos.Models;

public sealed class Customer
{
    public int Id { get; set; }
    public int OwnerId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Address { get; set; }
    public int LoyaltyPoints { get; set; }
    public decimal TotalSpent { get; set; }
    public int TotalVisits { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}
