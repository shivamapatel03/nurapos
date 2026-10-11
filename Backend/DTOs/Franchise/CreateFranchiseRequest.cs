using System.ComponentModel.DataAnnotations;

namespace Nurapos.DTOs.Franchise;

public class CreateFranchiseRequest
{
    [Required(ErrorMessage = "Franchise name is required.")]
    [StringLength(
        100,
        MinimumLength = 2,
        ErrorMessage = "Franchise name must be between 2 and 100 characters."
    )]
    public string FranchiseName { get; set; } = string.Empty;

    [StringLength(
        100,
        ErrorMessage = "Owner name cannot exceed 100 characters."
    )]
    public string? OwnerName { get; set; }

    [RegularExpression(
        @"^[0-9]{10,15}$",
        ErrorMessage = "Contact must contain 10 to 15 digits."
    )]
    public string? Contact { get; set; }

    [StringLength(500, ErrorMessage = "Address cannot exceed 500 characters.")]
    public string? Address { get; set; }

    [StringLength(50, ErrorMessage = "City cannot exceed 50 characters.")]
    public string? City { get; set; }
}
