using Nurapos.Models;

namespace Nurapos.Repositories.Interfaces;

public interface IOnboardingRepository
{
    Task EnsureSchemaAsync();
    Task<OnboardingRecord?> GetAsync(int userId);
    Task UpsertDraftAsync(OnboardingRecord record);
    Task<bool> CompleteAsync(int userId);
}
