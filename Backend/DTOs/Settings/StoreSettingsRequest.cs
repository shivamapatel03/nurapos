using System.ComponentModel.DataAnnotations;
using Nurapos.Models;

namespace Nurapos.DTOs.Settings;

public sealed class StoreSettingsRequest : StoreSettings
{
    [Required, RegularExpression(@"^[A-Z]{3}$")] public new string CurrencyCode { get => base.CurrencyCode; set => base.CurrencyCode=value; }
    [Required, StringLength(4)] public new string CurrencySymbol { get => base.CurrencySymbol; set => base.CurrencySymbol=value; }
    [Range(typeof(decimal),"0","100")] public new decimal DefaultTaxRate { get=>base.DefaultTaxRate; set=>base.DefaultTaxRate=value; }
    [Required, RegularExpression(@"^(none|nearest_1|nearest_0.50)$")] public new string RoundingRule { get=>base.RoundingRule; set=>base.RoundingRule=value; }
}

public sealed class HardwareSettingsRequest : HardwareSettings
{
    [Range(1,65535)] public new int? PrinterPort { get=>base.PrinterPort; set=>base.PrinterPort=value; }
    [Range(1,200)] public new int? CharacterWidth { get=>base.CharacterWidth; set=>base.CharacterWidth=value; }
}
