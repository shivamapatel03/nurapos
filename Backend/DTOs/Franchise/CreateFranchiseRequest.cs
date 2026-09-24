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

    [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
    [StringLength(
        100,
        ErrorMessage = "Email cannot exceed 100 characters."
    )]
    public string? Email { get; set; }

    public string? Address { get; set; }

    [StringLength(50, ErrorMessage = "City cannot exceed 50 characters.")]
    public string? City { get; set; }
}