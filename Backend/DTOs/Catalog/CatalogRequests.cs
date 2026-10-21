using System.ComponentModel.DataAnnotations;

namespace Nurapos.DTOs.Catalog;

public sealed class CategoryRequest
{
    [Required, StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;
    [StringLength(1000)]
    public string? Description { get; set; }
    [Required, RegularExpression(@"\A(ACTIVE|INACTIVE)\z")]
    public string Status { get; set; } = "ACTIVE";
}

public sealed class ExpenseCategoryRequest
{
    [Required, StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;
    [StringLength(1000)]
    public string? Description { get; set; }
    [Required, RegularExpression(@"\A(ACTIVE|INACTIVE)\z")]
    public string Status { get; set; } = "ACTIVE";
}

public sealed class SupplierRequest
{
    [Required, StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;
    [RegularExpression(@"\A[0-9]{10,15}\z")]
    public string? Contact { get; set; }
    [EmailAddress, StringLength(100)]
    public string? Email { get; set; }
    [StringLength(1000)]
    public string? Address { get; set; }
    [Required, RegularExpression(@"\A(ACTIVE|INACTIVE)\z")]
    public string Status { get; set; } = "ACTIVE";
}

public sealed class ProductRequest
{
    [Required, StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;
    [Range(1, int.MaxValue)]
    public int? CategoryId { get; set; }
    [Range(typeof(decimal), "0", "9999999999.99")]
    public decimal SellingPrice { get; set; }
    [Range(typeof(decimal), "0", "9999999999.99")]
    public decimal CostPrice { get; set; }
    [Range(typeof(decimal), "0", "28")]
    public decimal TaxRate { get; set; }
    [Required, RegularExpression(@"\A(inclusive|exclusive)\z")]
    public string TaxType { get; set; } = "exclusive";
    [Required, StringLength(20, MinimumLength = 1)]
    public string Unit { get; set; } = "PIECE";
    [Required, RegularExpression(@"\A(ACTIVE|INACTIVE)\z")]
    public string Status { get; set; } = "ACTIVE";
}
