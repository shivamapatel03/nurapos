using System.ComponentModel.DataAnnotations;

namespace Nurapos.DTOs.Auth;

public class LoginRequest
{
    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email address.")]
    [StringLength(100, ErrorMessage = "Email cannot exceed 100 characters.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    [StringLength(64, ErrorMessage = "Password cannot exceed 64 characters.")]
    public string Password { get; set; } = string.Empty;
}
