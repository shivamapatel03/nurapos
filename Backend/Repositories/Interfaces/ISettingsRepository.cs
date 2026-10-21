using Nurapos.Models;

namespace Nurapos.Repositories.Interfaces;

public interface ISettingsRepository
{
    Task EnsureSchemaAsync();
    Task<SettingsEntry?> GetAsync(int ownerId,string category);
    Task UpsertAsync(SettingsEntry entry);
}
