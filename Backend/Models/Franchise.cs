namespace Nurapos.Models;

public class Franchise
{
    public int FranchiseId { get; set; }

    public string FranchiseName { get; set; } = string.Empty;

    public string? OwnerName { get; set; }

    public string? Contact { get; set; }

    public string? Email { get; set; }

    public string? Address { get; set; }

    public string? City { get; set; }

    public string Status { get; set; } = "ACTIVE";

    public DateTime CreatedAt { get; set; }
}