using System.ComponentModel.DataAnnotations;

namespace Nurapos.DTOs.Auth;

public sealed class PosPinRequest
{
    [Required(ErrorMessage = "A four-digit POS PIN is required.")]
    [RegularExpression(@"\A[0-9]{4}\z", ErrorMessage = "POS PIN must contain exactly four digits.")]
    public string Pin { get; set; } = string.Empty;
}
