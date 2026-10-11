using System.ComponentModel.DataAnnotations;

namespace Nurapos.Models;

public sealed class OwnerPaymentMode
{
    [Range(1, int.MaxValue)]
    public int Id { get; set; }

    [Required, StringLength(20, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [Required, RegularExpression(@"\A(ACTIVE|INACTIVE)\z")]
    public string Status { get; set; } = "ACTIVE";
}
