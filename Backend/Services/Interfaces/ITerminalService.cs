using Nurapos.DTOs.Terminals;
using Nurapos.Models;

namespace Nurapos.Services.Interfaces;

public interface ITerminalService
{
    Task<PosTerminal> RegisterAsync(RegisterTerminalRequest request, int ownerId);
    Task<bool> HeartbeatAsync(string terminalCode, TerminalHeartbeatRequest request, int ownerId);
    Task<IReadOnlyList<Employee>> GetEligibleEmployeesAsync(string terminalCode, int ownerId);
    Task<PosPinLoginResponse> AuthenticateEmployeeAsync(PosPinLoginRequest request);
}
