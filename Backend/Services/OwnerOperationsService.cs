using Nurapos.DTOs.Operations;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;
using Nurapos.Services.Interfaces;

namespace Nurapos.Services;

public sealed class OwnerOperationsService : IOwnerOperationsService
{
    private readonly IOwnerOperationsRepository _repository;
    public OwnerOperationsService(IOwnerOperationsRepository repository) => _repository = repository;

    public Task<ExpenseRecord> CreateExpenseAsync(ExpenseRequest request, int ownerId) =>
        _repository.CreateExpenseAsync(new ExpenseRecord
        {
            FranchiseId = request.FranchiseId,
            ExpenseCategoryId = request.ExpenseCategoryId,
            UserId = ownerId,
            ExpenseDate = request.ExpenseDate ?? DateTime.UtcNow.Date,
            Amount = request.Amount,
            Description = request.Description?.Trim(),
            PaymentMethod = request.PaymentMethod.Trim().ToUpperInvariant(),
            ReceiptImage = request.ReceiptImage?.Trim()
        }, ownerId);

    public Task<List<OwnerPaymentMode>> GetPaymentModesAsync(int ownerId) =>
        _repository.GetPaymentModesAsync(ownerId);

    public Task<OwnerPaymentMode> CreatePaymentModeAsync(PaymentModeRequest request, int ownerId) =>
        _repository.CreatePaymentModeAsync(request.Name.Trim().ToUpperInvariant(), ownerId);

    public Task<List<ExpenseRecord>> GetExpensesAsync(int ownerId, int? franchiseId) =>
        _repository.GetExpensesAsync(ownerId, franchiseId);

    public Task<BillRecord> CreateSaleAsync(SaleRequest request, int ownerId)
    {
        request.PaymentMethod = request.PaymentMethod.Trim().ToUpperInvariant();
        return _repository.CreateSaleAsync(request, ownerId);
    }

    public Task<List<BillRecord>> GetSalesAsync(int ownerId, int? franchiseId) =>
        _repository.GetSalesAsync(ownerId, franchiseId);

    public Task<BillRecord?> GetSaleAsync(int id, int ownerId) =>
        _repository.GetSaleAsync(id, ownerId);

    public Task<BillRecord> CreatePurchaseAsync(PurchaseRequest request, int ownerId) =>
        _repository.CreatePurchaseAsync(request, ownerId);

    public Task<List<BillRecord>> GetPurchasesAsync(int ownerId, int? franchiseId) =>
        _repository.GetPurchasesAsync(ownerId, franchiseId);

    public Task<BillRecord?> GetPurchaseAsync(int id, int ownerId) =>
        _repository.GetPurchaseAsync(id, ownerId);

    public Task<List<FranchiseProductRecord>> GetInventoryAsync(int franchiseId, int ownerId) =>
        _repository.GetInventoryAsync(franchiseId, ownerId);

    public Task<FranchiseProductRecord?> SetInventoryAsync(int franchiseId, int productId, FranchiseProductRequest request, int ownerId) =>
        _repository.SetInventoryAsync(franchiseId, productId, request, ownerId);

    public Task<List<PaymentRecord>> GetPaymentsAsync(int ownerId, int? franchiseId) =>
        _repository.GetPaymentsAsync(ownerId, franchiseId);

    public Task<List<DailySummaryRecord>> GetDailySummariesAsync(int ownerId, int? franchiseId) =>
        _repository.GetDailySummariesAsync(ownerId, franchiseId);
}
