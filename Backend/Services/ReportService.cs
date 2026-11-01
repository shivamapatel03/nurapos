using Nurapos.DTOs.Reports;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;
using Nurapos.Services.Interfaces;

namespace Nurapos.Services;

public sealed class ReportService(IReportRepository repository) : IReportService
{
    public async Task<SalesTaxReport> SalesTaxAsync(int ownerId, ReportRangeRequest range)
    {
        var (from, to, fid) = NormalizeRange(range);
        var totals = await repository.GetTaxTotalsAsync(ownerId, fid, from, to);
        var taxableSales = totals.Sales.Sum(s => s.TaxableAmount);
        var totalTax = totals.Sales.Sum(s => s.TaxAmount);

        return new SalesTaxReport
        {
            From = from,
            To = to,
            TaxableSales = taxableSales,
            TotalTax = totalTax,
            OrderCount = totals.OrderCount,
            SalesByRate = totals.Sales,
            PurchasesByRate = totals.Purchases
        };
    }

    public async Task<ProfitLossReport> ProfitLossAsync(int ownerId, ReportRangeRequest range)
    {
        var (from, to, fid) = NormalizeRange(range);
        var totals = await repository.GetProfitLossAsync(ownerId, fid, from, to);
        var grossMargin = totals.Sales - totals.Cogs;
        var marginPercent = totals.Sales > 0 ? Math.Round((grossMargin / totals.Sales) * 100, 2) : 0;
        var netProfit = totals.Sales - totals.Cogs - totals.Expenses;

        return new ProfitLossReport
        {
            GrossSales = totals.Sales,
            DiscountsAndRefunds = 0,
            NetSales = totals.Sales,
            CostOfGoodsSold = totals.Cogs,
            OperatingExpenses = totals.Expenses,
            NetOperatingProfit = netProfit,
            GrossMargin = grossMargin,
            MarginPercent = marginPercent,
            CostOfGoodsSoldUsesCurrentProductCost = true
        };
    }

    public Task<IReadOnlyList<ZReportRecord>> ZReportsAsync(int ownerId, ReportRangeRequest range)
    {
        var (from, to, fid) = NormalizeRange(range);
        return repository.GetZReportsAsync(ownerId, fid, from, to);
    }

    public Task<InventoryValuationReport> InventoryValuationAsync(int ownerId, int franchiseId) =>
        repository.GetInventoryValuationAsync(ownerId, franchiseId);

    private static (DateOnly From, DateOnly To, int FranchiseId) NormalizeRange(ReportRangeRequest range)
    {
        var from = range?.From ?? DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-30));
        var to = range?.To ?? DateOnly.FromDateTime(DateTime.UtcNow);
        if (to < from) throw new ArgumentException("End date must be on or after start date.");
        var fid = range?.FranchiseId ?? 0;
        return (from, to, fid);
    }
}
