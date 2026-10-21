using Nurapos.Models;

namespace Nurapos.Repositories.Interfaces;

public interface IReportRepository
{
    Task<(IReadOnlyList<TaxSlabBreakdown> Sales,IReadOnlyList<TaxSlabBreakdown> Purchases)> GetTaxTotalsAsync(int ownerId,int franchiseId,DateOnly from,DateOnly to);
    Task<(decimal Sales,decimal Expenses,decimal Cogs)> GetProfitLossAsync(int ownerId,int franchiseId,DateOnly from,DateOnly to);
    Task<IReadOnlyList<ZReportRecord>> GetZReportsAsync(int ownerId,int franchiseId,DateOnly from,DateOnly to);
    Task<InventoryValuationReport> GetInventoryValuationAsync(int ownerId,int franchiseId);
}
