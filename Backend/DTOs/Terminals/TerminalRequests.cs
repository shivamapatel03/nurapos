using System.ComponentModel.DataAnnotations;

namespace Nurapos.DTOs.Terminals;

public sealed class RegisterTerminalRequest
{
    [Range(1, int.MaxValue)] public int FranchiseId { get; set; }
    [Required, StringLength(32, MinimumLength = 2)] public string TerminalCode { get; set; } = string.Empty;
    [Required, StringLength(100, MinimumLength = 2)] public string DeviceName { get; set; } = string.Empty;
    [StringLength(80)] public string? Platform { get; set; }
    [StringLength(200)] public string? HardwareIdentifier { get; set; }
}

public sealed class TerminalHeartbeatRequest
{
    [StringLength(40)] public string? AppVersion { get; set; }
    [Range(typeof(decimal), "0", "100")] public decimal? BatteryPercent { get; set; }
    [StringLength(1000)] public string? PeripheralStatus { get; set; }
}

public sealed class PosPinLoginRequest
{
    [Required, StringLength(32)] public string TerminalId { get; set; } = string.Empty;
    [Range(1, int.MaxValue)] public int EmployeeId { get; set; }
    [Required, RegularExpression(@"^\d{4}$")] public string Pin { get; set; } = string.Empty;
}

public sealed class PosPinLoginResponse
{
    public string PosSessionToken { get; init; } = string.Empty;
    public EmployeeSummary Employee { get; init; } = new();
    public bool ShiftRequired { get; init; }
}

public sealed class EmployeeSummary
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
}
