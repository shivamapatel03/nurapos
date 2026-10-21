namespace Nurapos.Models;

public sealed class DiningTable
{
    public int Id { get; set; }
    public int FranchiseId { get; set; }
    public string TableNumber { get; set; } = string.Empty;
    public string Section { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public string Status { get; set; } = "VACANT";
    public string? ActiveOrderId { get; set; }
}
