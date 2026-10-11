using Nurapos.DTOs.Operations;
using Nurapos.Models;

namespace Nurapos.Services.Interfaces;

public interface IOwnerOperationsService
{
    Task<ExpenseRecord> CreateExpenseAsync(ExpenseRequest request, int ownerId);
    Task<List<OwnerPaymentMode>> GetPaymentModesAsync(int ownerId);
    Task<OwnerPaymentMode> CreatePaymentModeAsync(PaymentModeRequest request, int ownerId);
    Task<List<ExpenseRecord>> GetExpensesAsync(int ownerId, int? franchiseId);
    Task<BillRecord> CreateSaleAsync(SaleRequest request, int ownerId);
    Task<List<BillRecord>> GetSalesAsync(int ownerId, int? franchiseId);
    Task<BillRecord?> GetSaleAsync(int id, int ownerId);
    Task<BillRecord> CreatePurchaseAsync(PurchaseRequest request, int ownerId);
    Task<List<BillRecord>> GetPurchasesAsync(int ownerId, int? franchiseId);
    Task<BillRecord?> GetPurchaseAsync(int id, int ownerId);
    Task<List<FranchiseProductRecord>> GetInventoryAsync(int franchiseId, int ownerId);
    Task<FranchiseProductRecord?> SetInventoryAsync(int franchiseId, int productId, FranchiseProductRequest request, int ownerId);
    Task<List<PaymentRecord>> GetPaymentsAsync(int ownerId, int? franchiseId);
    Task<List<DailySummaryRecord>> GetDailySummariesAsync(int ownerId, int? franchiseId);
}
