using System.ComponentModel.DataAnnotations;

namespace Nurapos.DTOs.Auth;

public class RefreshTokenRequest
{
    [Required(ErrorMessage = "Refresh token is required.")]
    [StringLength(200, MinimumLength = 50, ErrorMessage = "Refresh token has an invalid length.")]
    public string RefreshToken { get; set; } = string.Empty;
}
