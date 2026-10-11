using System.ComponentModel.DataAnnotations;

namespace Nurapos.DTOs.Operations;

public sealed class ExpenseRequest
{
    [Range(1, int.MaxValue)] public int FranchiseId { get; set; }
    [Range(1, int.MaxValue)] public int ExpenseCategoryId { get; set; }
    [Range(typeof(decimal), "0.01", "9999999999.99")] public decimal Amount { get; set; }
    [Required, RegularExpression(@"\A(CASH|CARD|UPI|BANK_TRANSFER|OTHER)\z")] public string PaymentMethod { get; set; } = "CASH";
    [StringLength(1000)] public string? Description { get; set; }
    [StringLength(2000)] public string? ReceiptImage { get; set; }
    public DateTime? ExpenseDate { get; set; }
}

public sealed class SaleRequest
{
    [Range(1, int.MaxValue)] public int FranchiseId { get; set; }
    [Required, StringLength(20, MinimumLength = 2)] public string PaymentMethod { get; set; } = string.Empty;
    [Required, MinLength(1, ErrorMessage = "At least one sale item is required.")]
    public List<SaleLineRequest> Items { get; set; } = [];
}

public sealed class PaymentModeRequest
{
    [Required, StringLength(20, MinimumLength = 2)]
    [RegularExpression(@"\A[A-Za-z0-9][A-Za-z0-9 _-]*\z", ErrorMessage = "Payment mode can contain letters, numbers, spaces, hyphens, and underscores.")]
    public string Name { get; set; } = string.Empty;
}

public sealed class SaleLineRequest
{
    [Range(1, int.MaxValue)] public int ProductId { get; set; }
    [Range(typeof(decimal), "0.01", "999999.99")] public decimal Quantity { get; set; }
}

public sealed class PurchaseRequest
{
    [Range(1, int.MaxValue)] public int FranchiseId { get; set; }
    [Range(1, int.MaxValue)] public int? SupplierId { get; set; }
    [Required, RegularExpression(@"\A(CASH|CARD|UPI|BANK_TRANSFER|CREDIT|OTHER)\z")] public string PaymentMethod { get; set; } = "CASH";
    [Required, MinLength(1, ErrorMessage = "At least one purchase item is required.")]
    public List<PurchaseLineRequest> Items { get; set; } = [];
}

public sealed class PurchaseLineRequest
{
    [Range(1, int.MaxValue)] public int ProductId { get; set; }
    [Range(typeof(decimal), "0.01", "999999.99")] public decimal Quantity { get; set; }
    [Range(typeof(decimal), "0", "9999999999.99")] public decimal UnitPrice { get; set; }
}

public sealed class FranchiseProductRequest
{
    [Range(typeof(decimal), "0", "9999999999.99")]
    public decimal StockQuantity { get; set; }
    [Range(typeof(decimal), "0", "9999999999.99")]
    public decimal? SellingPrice { get; set; }
    [Required, RegularExpression(@"\A(ACTIVE|INACTIVE)\z")]
    public string Status { get; set; } = "ACTIVE";
}
