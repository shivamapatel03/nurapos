using System.ComponentModel.DataAnnotations;

namespace Nurapos.DTOs.Auth;

public sealed class EmailRequest
{
    [Required, EmailAddress, StringLength(100)] public string Email { get; set; } = string.Empty;
}
