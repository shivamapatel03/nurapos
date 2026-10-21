using Nurapos.DTOs.Onboarding;

namespace Nurapos.Services.Interfaces;

public interface IOnboardingService
{
    Task<OnboardingStatusResponse> GetStatusAsync(int userId);
    Task<OnboardingStatusResponse> SaveDraftAsync(int userId, OnboardingDraftRequest request);
    Task CompleteAsync(int userId);
}
