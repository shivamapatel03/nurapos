using System.ComponentModel.DataAnnotations;

namespace Nurapos.DTOs.Shifts;

public sealed class OpenShiftRequest
{
    [Required, StringLength(32)] public string TerminalId { get; set; } = string.Empty;
    [Range(1, int.MaxValue)] public int FranchiseId { get; set; }
    [Range(typeof(decimal), "0", "999999999.99")] public decimal OpeningFloat { get; set; }
    [Range(1, int.MaxValue)] public int CashierId { get; set; }
    [StringLength(1000)] public string? Notes { get; set; }
}

public sealed class CashMovementRequest
{
    [Required] public string ShiftId { get; set; } = string.Empty;
    [Required, RegularExpression(@"^(PAY_IN|PAY_OUT)$")] public string Type { get; set; } = string.Empty;
    [Range(typeof(decimal), "0.01", "999999999.99")] public decimal Amount { get; set; }
    [Required, StringLength(500)] public string Reason { get; set; } = string.Empty;
}

public sealed class CloseShiftRequest
{
    [Required, StringLength(40)] public string ShiftId { get; set; } = string.Empty;
    [Range(typeof(decimal), "0", "999999999.99")] public decimal ClosingCashActual { get; set; }
    [StringLength(1000)] public string? Notes { get; set; }
}

public sealed class ShiftCloseResponse
{
    public string ShiftId { get; init; } = string.Empty;
    public decimal ExpectedCash { get; init; }
    public decimal ActualCash { get; init; }
    public decimal CashDifference { get; init; }
    public decimal TotalSales { get; init; }
    public decimal CashTotal { get; init; }
    public decimal CardTotal { get; init; }
    public decimal UpiTotal { get; init; }
    public bool ZReportGenerated { get; init; }
}
