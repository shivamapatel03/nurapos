namespace Nurapos.Models;

public sealed class PosTerminal
{
    public int Id { get; set; }
    public int OwnerId { get; set; }
    public int FranchiseId { get; set; }
    public string TerminalCode { get; set; } = string.Empty;
    public string DeviceName { get; set; } = string.Empty;
    public string? Platform { get; set; }
    public string? HardwareIdentifier { get; set; }
    public DateTime? LastHeartbeatUtc { get; set; }
    public string? AppVersion { get; set; }
    public decimal? BatteryPercent { get; set; }
    public string? PeripheralStatus { get; set; }
}
