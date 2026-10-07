using System.ComponentModel.DataAnnotations;

namespace Nurapos.DTOs.Auth;

public class SignupRequest
{
    [Required(ErrorMessage = "Name is required.")]
    [StringLength(
        100,
        MinimumLength = 2,
        ErrorMessage = "Name must be between 2 and 100 characters."
    )]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email address.")]
    [StringLength(
        255,
        ErrorMessage = "Email cannot exceed 255 characters."
    )]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    [StringLength(
        64,
        MinimumLength = 8,
        ErrorMessage = "Password must be between 8 and 64 characters."
    )]
    [RegularExpression(
        @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$",
        ErrorMessage = "Password must contain uppercase, lowercase, number, and special character."
    )]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Confirm password is required.")]
    [Compare(
        "Password",
        ErrorMessage = "Passwords do not match."
    )]
    public string ConfirmPassword { get; set; } = string.Empty;
}