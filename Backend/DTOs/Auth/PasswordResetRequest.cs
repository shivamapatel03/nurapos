using System.ComponentModel.DataAnnotations;

namespace Nurapos.DTOs.Auth;

public sealed class PasswordResetRequest
{
    [Required, EmailAddress, StringLength(100)] public string Email { get; set; } = string.Empty;
    [Required] public string ResetToken { get; set; } = string.Empty;
    [Required, StringLength(64, MinimumLength = 8)]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$")]
    public string NewPassword { get; set; } = string.Empty;
    [Required, Compare(nameof(NewPassword))] public string ConfirmPassword { get; set; } = string.Empty;
}
