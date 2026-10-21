using System.ComponentModel.DataAnnotations;

namespace Nurapos.DTOs.Auth;

public sealed class EmailCodeRequest
{
    [Required, EmailAddress, StringLength(100)] public string Email { get; set; } = string.Empty;
    [Required, RegularExpression(@"^\d{4}$", ErrorMessage = "Code must be exactly 4 digits.")]
    public string Code { get; set; } = string.Empty;
    [StringLength(64)] public string? VerificationId { get; set; }
}
