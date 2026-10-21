using System.ComponentModel.DataAnnotations;

namespace Nurapos.DTOs.Offers;

public sealed class CreateOfferRequest
{
    [Range(1,int.MaxValue)] public int FranchiseId { get; set; }
    [Required,StringLength(120)] public string Title { get; set; } = string.Empty;
    [Required,StringLength(32)] public string BadgeText { get; set; } = string.Empty;
    [Required,RegularExpression(@"^(percentage|fixed_amount|promo_price)$")] public string DiscountType { get; set; } = string.Empty;
    [Range(typeof(decimal),"0.01","999999999.99")] public decimal DiscountValue { get; set; }
    [Required,RegularExpression(@"^(all|category|product)$")] public string AppliesTo { get; set; } = "all";
    public List<int> TargetIds { get; set; } = [];
    [Range(typeof(decimal),"0","999999999.99")] public decimal MinSubtotal { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public bool IsActive { get; set; } = true;
}

public sealed class ValidateDiscountCodeRequest
{
    [Required,StringLength(32)] public string Code { get; set; } = string.Empty;
    [Range(1,int.MaxValue)] public int FranchiseId { get; set; }
    [Range(typeof(decimal),"0.01","999999999.99")] public decimal Subtotal { get; set; }
}

public sealed class DiscountValidationResponse
{
    public bool IsValid { get; init; }
    public string? Code { get; init; }
    public decimal DiscountAmount { get; init; }
    public string? Reason { get; init; }
}
