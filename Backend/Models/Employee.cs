namespace Nurapos.Models;

public sealed class Employee
{
    public int Id { get; set; }
    public int FranchiseId { get; set; }
    public string EmployeeCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public bool IsActive { get; set; }
    public bool PinConfigured { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}
