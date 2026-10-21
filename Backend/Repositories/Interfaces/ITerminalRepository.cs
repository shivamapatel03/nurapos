using Nurapos.Models;

namespace Nurapos.Repositories.Interfaces;

public interface ITerminalRepository
{
    Task EnsureSchemaAsync();
    Task<PosTerminal> RegisterAsync(PosTerminal terminal, int ownerId);
    Task<bool> HeartbeatAsync(string terminalCode, TerminalHeartbeatData heartbeat, int ownerId);
    Task<IReadOnlyList<Employee>> GetEligibleEmployeesAsync(string terminalCode, int ownerId);
    Task<PosEmployeeAuth?> GetEmployeePinAsync(string terminalCode, int employeeId);
}

public sealed record TerminalHeartbeatData(string? AppVersion, decimal? BatteryPercent, string? PeripheralStatus);
public sealed record PosEmployeeAuth(Employee Employee,string? PinHash,int OwnerId,int FranchiseId,string TerminalCode);
