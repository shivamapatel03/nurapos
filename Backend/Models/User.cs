using System.ComponentModel.DataAnnotations;

namespace Nurapos.Models;

public class User
{
    [Range(0, int.MaxValue)]
    public int UserId { get; set; }

    [Required(ErrorMessage = "Name is required.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email address.")]
    [StringLength(100, ErrorMessage = "Email cannot exceed 100 characters.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password hash is required.")]
    [StringLength(500, MinimumLength = 1, ErrorMessage = "Password hash cannot exceed 500 characters.")]
    public string PasswordHash { get; set; } = string.Empty;

    [Required(ErrorMessage = "Role is required.")]
    [StringLength(50, ErrorMessage = "Role cannot exceed 50 characters.")]
    public string Role { get; set; } = "FRANCHISE_OWNER";

    public bool IsVerified { get; set; } = true;

    [Required]
    public DateTime CreatedAt { get; set; }
}
