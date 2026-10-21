namespace Nurapos.Models;

public sealed class RegisterShift
{
    public string ShiftId { get; set; } = string.Empty;
    public int FranchiseId { get; set; }
    public string TerminalId { get; set; } = string.Empty;
    public int CashierId { get; set; }
    public DateTime OpenedAtUtc { get; set; }
    public DateTime? ClosedAtUtc { get; set; }
    public string Status { get; set; } = "OPEN";
    public decimal OpeningFloat { get; set; }
    public decimal TotalSales { get; set; }
    public decimal CashSales { get; set; }
    public decimal CardTotal { get; set; }
    public decimal UpiTotal { get; set; }
    public decimal? ExpectedCash { get; set; }
    public decimal? ActualCash { get; set; }
    public decimal? CashDifference { get; set; }
    public string? Notes { get; set; }
}
