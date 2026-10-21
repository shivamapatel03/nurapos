using Nurapos.DTOs.Reports;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;
using Nurapos.Services.Interfaces;

namespace Nurapos.Services;

public sealed class ReportService(IReportRepository repository):IReportService
{
    public async Task<SalesTaxReport> SalesTaxAsync(int ownerId,ReportRangeRequest range)
    {
        ValidateRange(range);var totals=await repository.GetTaxTotalsAsync(ownerId,range.FranchiseId,range.From,range.To);
        return new SalesTaxReport{From=range.From,To=range.To,SalesByRate=totals.Sales,PurchasesByRate=totals.Purchases};
    }
    public async Task<ProfitLossReport> ProfitLossAsync(int ownerId,ReportRangeRequest range)
    {
        ValidateRange(range);var totals=await repository.GetProfitLossAsync(ownerId,range.FranchiseId,range.From,range.To);
        return new ProfitLossReport{GrossSales=totals.Sales,DiscountsAndRefunds=0,NetSales=totals.Sales,CostOfGoodsSold=totals.Cogs,
            OperatingExpenses=totals.Expenses,NetOperatingProfit=totals.Sales-totals.Cogs-totals.Expenses,CostOfGoodsSoldUsesCurrentProductCost=true};
    }
    public Task<IReadOnlyList<ZReportRecord>> ZReportsAsync(int ownerId,ReportRangeRequest range)
    {ValidateRange(range);return repository.GetZReportsAsync(ownerId,range.FranchiseId,range.From,range.To);}
    public Task<InventoryValuationReport> InventoryValuationAsync(int ownerId,int franchiseId)=>repository.GetInventoryValuationAsync(ownerId,franchiseId);
    private static void ValidateRange(ReportRangeRequest range){if(range.From==default||range.To==default)throw new ArgumentException("Both from and to dates are required.");if(range.To<range.From)throw new ArgumentException("End date must be on or after start date.");}
}
