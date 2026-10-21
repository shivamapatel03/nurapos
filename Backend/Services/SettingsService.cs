using System.Text.Json;
using Nurapos.DTOs.Settings;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;
using Nurapos.Services.Interfaces;

namespace Nurapos.Services;

public sealed class SettingsService(ISettingsRepository repository):ISettingsService
{
    private static readonly JsonSerializerOptions JsonOptions=new(JsonSerializerDefaults.Web);
    public async Task<StoreSettings> GetStoreAsync(int ownerId)=>await ReadAsync<StoreSettings>(ownerId,"store")??new StoreSettings();
    public async Task<StoreSettings> SaveStoreAsync(int ownerId,StoreSettingsRequest request)
    {
        if(request.DefaultTaxRate is not (0 or 5 or 12 or 18 or 28)) throw new ArgumentException("Default tax rate must be one of 0, 5, 12, 18, or 28 percent.");
        var settings=new StoreSettings{CurrencyCode=request.CurrencyCode,CurrencySymbol=request.CurrencySymbol,DefaultTaxRate=request.DefaultTaxRate,
            TaxInclusive=request.TaxInclusive,InvoiceHeaderTitle=request.InvoiceHeaderTitle?.Trim(),TaxId=request.TaxId?.Trim(),ReceiptFooter=request.ReceiptFooter?.Trim(),RoundingRule=request.RoundingRule};
        await WriteAsync(ownerId,"store",settings);return settings;
    }
    public async Task<HardwareSettings> GetHardwareAsync(int ownerId)=>await ReadAsync<HardwareSettings>(ownerId,"hardware")??new HardwareSettings();
    public async Task<HardwareSettings> SaveHardwareAsync(int ownerId,HardwareSettingsRequest request)
    {
        var settings=new HardwareSettings{PrinterHost=request.PrinterHost?.Trim(),PrinterPort=request.PrinterPort,CharacterWidth=request.CharacterWidth,
            CashDrawerKickCode=request.CashDrawerKickCode?.Trim(),ScannerContinuousRead=request.ScannerContinuousRead};
        await WriteAsync(ownerId,"hardware",settings);return settings;
    }
    private async Task<T?> ReadAsync<T>(int ownerId,string category)
    {
        var entry=await repository.GetAsync(ownerId,category);
        return entry is null?default:JsonSerializer.Deserialize<T>(entry.JsonValue,JsonOptions);
    }
    private Task WriteAsync<T>(int ownerId,string category,T value)=>repository.UpsertAsync(new SettingsEntry
    {OwnerId=ownerId,Category=category,JsonValue=JsonSerializer.Serialize(value,JsonOptions)});
}
