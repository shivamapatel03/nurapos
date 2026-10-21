using Nurapos.DTOs.Reports;
using Nurapos.Models;

namespace Nurapos.Services.Interfaces;

public interface IReportService
{
    Task<SalesTaxReport> SalesTaxAsync(int ownerId,ReportRangeRequest range);
    Task<ProfitLossReport> ProfitLossAsync(int ownerId,ReportRangeRequest range);
    Task<IReadOnlyList<ZReportRecord>> ZReportsAsync(int ownerId,ReportRangeRequest range);
    Task<InventoryValuationReport> InventoryValuationAsync(int ownerId,int franchiseId);
}
