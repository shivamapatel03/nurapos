using Nurapos.Models;

namespace Nurapos.Repositories.Interfaces;

public interface IShiftRepository
{
    Task EnsureSchemaAsync();
    Task<RegisterShift> OpenAsync(RegisterShift shift, int ownerId);
    Task<RegisterShift?> GetActiveAsync(int ownerId, string terminalId, int? cashierId);
    Task<bool> AddCashMovementAsync(int ownerId, string shiftId, string type, decimal amount, string reason, int? employeeId, string? terminalId);
    Task<ShiftCloseRecord?> CloseAsync(int ownerId, string shiftId, decimal actualCash, string? notes, int? employeeId, string? terminalId);
}

public sealed record ShiftCloseRecord(string ShiftId, decimal ExpectedCash, decimal ActualCash, decimal CashDifference, decimal TotalSales, decimal CashTotal, decimal CardTotal, decimal UpiTotal);
