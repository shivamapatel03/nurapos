namespace Nurapos.Models;

public sealed class Offer
{
    public int Id { get; set; }
    public int OwnerId { get; set; }
    public int FranchiseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string DiscountType { get; set; } = string.Empty;
    public decimal DiscountValue { get; set; }
    public string AppliesTo { get; set; } = "all";
    public int[] TargetIds { get; set; } = [];
    public decimal MinSubtotal { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public bool IsActive { get; set; }
}
