using Nurapos.DTOs.Terminals;
using Nurapos.Helpers;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;
using Nurapos.Services.Interfaces;

namespace Nurapos.Services;

public sealed class TerminalService(ITerminalRepository repository, IJwtHelper jwtHelper, IShiftRepository shiftRepository) : ITerminalService
{
    public Task<PosTerminal> RegisterAsync(RegisterTerminalRequest request, int ownerId) =>
        repository.RegisterAsync(new PosTerminal
        {
            FranchiseId = request.FranchiseId,
            TerminalCode = request.TerminalCode.Trim(),
            DeviceName = request.DeviceName.Trim(),
            Platform = BlankToNull(request.Platform),
            HardwareIdentifier = BlankToNull(request.HardwareIdentifier)
        }, ownerId);

    public Task<bool> HeartbeatAsync(string terminalCode, TerminalHeartbeatRequest request, int ownerId) =>
        repository.HeartbeatAsync(terminalCode.Trim(), new TerminalHeartbeatData(request.AppVersion, request.BatteryPercent, request.PeripheralStatus), ownerId);

    public Task<IReadOnlyList<Employee>> GetEligibleEmployeesAsync(string terminalCode, int ownerId) =>
        repository.GetEligibleEmployeesAsync(terminalCode.Trim(), ownerId);

    public async Task<PosPinLoginResponse> AuthenticateEmployeeAsync(PosPinLoginRequest request)
    {
        var auth = await repository.GetEmployeePinAsync(request.TerminalId.Trim(), request.EmployeeId);
        if (auth is null || auth.PinHash is null || !PasswordHelper.Verify(request.Pin, auth.PinHash))
            throw new UnauthorizedAccessException("Invalid terminal, employee, or PIN.");
        var employee = auth.Employee;
        var token = jwtHelper.GeneratePosToken(employee.Id, employee.Email ?? employee.EmployeeCode, employee.Role, auth.OwnerId, auth.FranchiseId, auth.TerminalCode);
        var activeShift = await shiftRepository.GetActiveAsync(auth.OwnerId, auth.TerminalCode, employee.Id);
        return new PosPinLoginResponse
        {
            PosSessionToken = token.Token,
            Employee = new EmployeeSummary { Id = employee.Id, Name = employee.Name, Role = employee.Role },
            ShiftRequired = activeShift is null
        };
    }

    private static string? BlankToNull(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
