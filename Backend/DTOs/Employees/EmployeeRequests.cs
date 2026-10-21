using System.ComponentModel.DataAnnotations;

namespace Nurapos.DTOs.Employees;

public sealed class CreateEmployeeRequest
{
    [Range(1, int.MaxValue)] public int FranchiseId { get; set; }
    [Required, StringLength(32, MinimumLength = 2)] public string EmployeeCode { get; set; } = string.Empty;
    [Required, StringLength(120, MinimumLength = 2)] public string Name { get; set; } = string.Empty;
    [Required, RegularExpression(@"^(Admin|Store Manager|Shift Supervisor|Senior Cashier|Cashier|Barista|Inventory Clerk|Kitchen Lead)$")]
    public string Role { get; set; } = string.Empty;
    [Phone, StringLength(32)] public string? Phone { get; set; }
    [EmailAddress, StringLength(100)] public string? Email { get; set; }
    [RegularExpression(@"^\d{4}$")] public string? InitialPin { get; set; }
}

public sealed class UpdateEmployeeRequest
{
    [Required, StringLength(120, MinimumLength = 2)] public string Name { get; set; } = string.Empty;
    [Required, RegularExpression(@"^(Admin|Store Manager|Shift Supervisor|Senior Cashier|Cashier|Barista|Inventory Clerk|Kitchen Lead)$")]
    public string Role { get; set; } = string.Empty;
    [Phone, StringLength(32)] public string? Phone { get; set; }
    [EmailAddress, StringLength(100)] public string? Email { get; set; }
    public bool IsActive { get; set; } = true;
}

public sealed class ResetEmployeePinRequest
{
    [Required, RegularExpression(@"^\d{4}$")] public string Pin { get; set; } = string.Empty;
    [Required, Compare(nameof(Pin))] public string ConfirmPin { get; set; } = string.Empty;
}
