using System.Text.Json;

namespace Nurapos.DTOs.Onboarding;

public sealed class OnboardingStatusResponse
{
    public bool IsCompleted { get; init; }
    public int CurrentStep { get; init; }
    public JsonElement Draft { get; init; }
}
