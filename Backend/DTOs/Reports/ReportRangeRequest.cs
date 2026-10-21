using System.ComponentModel.DataAnnotations;

namespace Nurapos.DTOs.Reports;

public sealed class ReportRangeRequest
{
    [Range(1,int.MaxValue)] public int FranchiseId { get; set; }
    public DateOnly From { get; set; }
    public DateOnly To { get; set; }
}

public sealed class InventoryReportRequest
{
    [Range(1,int.MaxValue)] public int FranchiseId { get; set; }
}
