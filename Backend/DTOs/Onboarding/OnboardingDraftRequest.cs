using System.Text.Json;
using System.Text.Json.Serialization;

namespace Nurapos.DTOs.Onboarding;

public sealed class OnboardingDraftRequest
{
    [JsonExtensionData]
    public Dictionary<string, JsonElement> Fields { get; set; } = new(StringComparer.OrdinalIgnoreCase);
}
