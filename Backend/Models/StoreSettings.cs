namespace Nurapos.Models;

public class StoreSettings
{
    public string? StoreName { get; set; }
    public string? StoreCode { get; set; }
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Website { get; set; }
    public string CurrencyCode { get; set; } = "INR";
    public string CurrencySymbol { get; set; } = "₹";
    public decimal DefaultTaxRate { get; set; }
    public bool TaxInclusive { get; set; }
    public string? InvoiceHeaderTitle { get; set; }
    public string? TaxId { get; set; }
    public string? ReceiptFooter { get; set; }
    public string RoundingRule { get; set; } = "none";
}

public class HardwareSettings
{
    public string? PrinterHost { get; set; }
    public int? PrinterPort { get; set; }
    public int? CharacterWidth { get; set; }
    public string? CashDrawerKickCode { get; set; }
    public bool ScannerContinuousRead { get; set; }
}

public sealed class SettingsEntry
{
    public int OwnerId { get; set; }
    public string Category { get; set; } = string.Empty;
    public string JsonValue { get; set; } = "{}";
    public DateTime UpdatedAtUtc { get; set; }
}
