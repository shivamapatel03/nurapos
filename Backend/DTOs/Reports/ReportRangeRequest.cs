namespace Nurapos.DTOs.Reports;

public sealed class ReportRangeRequest
{
    public int? FranchiseId { get; set; }
    public DateOnly? From { get; set; }
    public DateOnly? To { get; set; }
}

public sealed class InventoryReportRequest
{
    public int? FranchiseId { get; set; }
}
