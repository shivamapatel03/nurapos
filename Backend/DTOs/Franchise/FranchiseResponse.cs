namespace Nurapos.DTOs.Franchise;

public class FranchiseResponse
{
    public int FranchiseId { get; set; }

    public string FranchiseName { get; set; } = string.Empty;

    public string? OwnerName { get; set; }

    public string? Contact { get; set; }

    public string? Email { get; set; }

    public string? Address { get; set; }

    public string? City { get; set; }

    public string Status { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}