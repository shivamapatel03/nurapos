using Nurapos.DTOs.Settings;
using Nurapos.Models;

namespace Nurapos.Services.Interfaces;

public interface ISettingsService
{
    Task<StoreSettings> GetStoreAsync(int ownerId);
    Task<StoreSettings> SaveStoreAsync(int ownerId,StoreSettingsRequest request);
    Task<HardwareSettings> GetHardwareAsync(int ownerId);
    Task<HardwareSettings> SaveHardwareAsync(int ownerId,HardwareSettingsRequest request);
}
