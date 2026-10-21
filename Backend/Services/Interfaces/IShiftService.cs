using Nurapos.DTOs.Shifts;
using Nurapos.Models;

namespace Nurapos.Services.Interfaces;

public interface IShiftService
{
    Task<RegisterShift> OpenAsync(int ownerId, OpenShiftRequest request);
    Task<RegisterShift?> GetActiveAsync(int ownerId, string terminalId, int? cashierId);
    Task<bool> AddCashMovementAsync(int ownerId, CashMovementRequest request, int? employeeId, string? terminalId);
    Task<ShiftCloseResponse?> CloseAsync(int ownerId, CloseShiftRequest request, int? employeeId, string? terminalId);
}
