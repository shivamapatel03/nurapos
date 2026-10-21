using Nurapos.DTOs.Shifts;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;
using Nurapos.Services.Interfaces;

namespace Nurapos.Services;

public sealed class ShiftService(IShiftRepository repository) : IShiftService
{
    public Task<RegisterShift> OpenAsync(int ownerId, OpenShiftRequest request) => repository.OpenAsync(new RegisterShift
    {
        FranchiseId = request.FranchiseId, TerminalId = request.TerminalId.Trim(), CashierId = request.CashierId,
        OpeningFloat = request.OpeningFloat, Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim()
    }, ownerId);

    public Task<RegisterShift?> GetActiveAsync(int ownerId, string terminalId, int? cashierId) => repository.GetActiveAsync(ownerId, terminalId, cashierId);

    public Task<bool> AddCashMovementAsync(int ownerId, CashMovementRequest request, int? employeeId, string? terminalId) =>
        repository.AddCashMovementAsync(ownerId, request.ShiftId, request.Type, request.Amount, request.Reason.Trim(), employeeId, terminalId);

    public async Task<ShiftCloseResponse?> CloseAsync(int ownerId, CloseShiftRequest request, int? employeeId, string? terminalId)
    {
        var closed = await repository.CloseAsync(ownerId, request.ShiftId, request.ClosingCashActual, request.Notes, employeeId, terminalId);
        return closed is null ? null : new ShiftCloseResponse
        {
            ShiftId = closed.ShiftId, ExpectedCash = closed.ExpectedCash, ActualCash = closed.ActualCash,
            CashDifference = closed.CashDifference, TotalSales=closed.TotalSales,CashTotal=closed.CashTotal,
            CardTotal=closed.CardTotal,UpiTotal=closed.UpiTotal,ZReportGenerated = true
        };
    }
}
