using System.ComponentModel.DataAnnotations;

namespace Nurapos.Models;

public sealed class ExpenseRecord
{
    [Range(1, int.MaxValue)]
    public int ExpenseId { get; set; }

    [Range(1, int.MaxValue)]
    public int FranchiseId { get; set; }

    [Range(1, int.MaxValue)]
    public int ExpenseCategoryId { get; set; }

    [Range(1, int.MaxValue)]
    public int? UserId { get; set; }

    [Required]
    public DateTime ExpenseDate { get; set; }

    [Range(typeof(decimal), "0.01", "9999999999.99")]
    public decimal Amount { get; set; }

    [StringLength(1000)]
    public string? Description { get; set; }

    [Required, RegularExpression(@"\A(CASH|CARD|UPI|BANK_TRANSFER|OTHER)\z")]
    public string PaymentMethod { get; set; } = string.Empty;

    [StringLength(2000)]
    public string? ReceiptImage { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; }
}

public sealed class BillLineRecord
{
    [Range(1, int.MaxValue)]
    public int ProductId { get; set; }

    [Required, StringLength(100)]
    public string ProductName { get; set; } = string.Empty;

    [Range(typeof(decimal), "0.01", "999999.99")]
    public decimal Quantity { get; set; }

    [Range(typeof(decimal), "0", "9999999999.99")]
    public decimal UnitPrice { get; set; }

    [Range(typeof(decimal), "0", "9999999999.99")]
    public decimal TotalAmount { get; set; }
}

public sealed class BillRecord
{
    [Range(1, int.MaxValue)]
    public int Id { get; set; }

    [Range(1, int.MaxValue)]
    public int FranchiseId { get; set; }

    [Range(1, int.MaxValue)]
    public int? SupplierId { get; set; }

    [Required]
    public DateTime Date { get; set; }

    [Range(typeof(decimal), "0", "9999999999.99")]
    public decimal TotalAmount { get; set; }

    [Required, RegularExpression(@"\A(CASH|CARD|UPI|BANK_TRANSFER|CREDIT|OTHER)\z")]
    public string PaymentMethod { get; set; } = string.Empty;

    [Required, StringLength(20)]
    public string Status { get; set; } = string.Empty;

    public List<BillLineRecord> Items { get; set; } = [];
}

public sealed class FranchiseProductRecord
{
    [Range(1, int.MaxValue)]
    public int FranchiseProductId { get; set; }

    [Range(1, int.MaxValue)]
    public int FranchiseId { get; set; }

    [Range(1, int.MaxValue)]
    public int ProductId { get; set; }

    [Required, StringLength(100)]
    public string ProductName { get; set; } = string.Empty;

    [Range(typeof(decimal), "0", "9999999999.99")]
    public decimal StockQuantity { get; set; }

    [Range(typeof(decimal), "0", "9999999999.99")]
    public decimal? SellingPrice { get; set; }

    [Required, RegularExpression(@"\A(ACTIVE|INACTIVE)\z")]
    public string Status { get; set; } = string.Empty;
}

public sealed class PaymentRecord
{
    [Range(1, int.MaxValue)]
    public int PaymentId { get; set; }

    [Range(1, int.MaxValue)]
    public int FranchiseId { get; set; }

    [Required, RegularExpression(@"\A(SALE|PURCHASE)\z")]
    public string ReferenceType { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int ReferenceId { get; set; }

    [Required, RegularExpression(@"\A(CASH|CARD|UPI|BANK_TRANSFER|CREDIT|OTHER)\z")]
    public string PaymentMethod { get; set; } = string.Empty;

    [Range(typeof(decimal), "0.01", "9999999999.99")]
    public decimal Amount { get; set; }

    [Required]
    public DateTime PaymentDate { get; set; }

    [Required, StringLength(20)]
    public string Status { get; set; } = string.Empty;
}

public sealed class DailySummaryRecord
{
    [Range(1, int.MaxValue)]
    public int DailySummaryId { get; set; }

    [Range(1, int.MaxValue)]
    public int FranchiseId { get; set; }

    [Required]
    public DateTime SummaryDate { get; set; }

    [Range(typeof(decimal), "0", "9999999999.99")]
    public decimal TotalSales { get; set; }

    [Range(typeof(decimal), "0", "9999999999.99")]
    public decimal TotalPurchases { get; set; }

    [Range(typeof(decimal), "0", "9999999999.99")]
    public decimal TotalExpenses { get; set; }

    public decimal GrossProfit { get; set; }

    public decimal NetProfit { get; set; }
}
