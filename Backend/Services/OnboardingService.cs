using System.Text.Json;
using Nurapos.DTOs.Onboarding;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;
using Nurapos.Services.Interfaces;

namespace Nurapos.Services;

public sealed class OnboardingService(IOnboardingRepository repository) : IOnboardingService
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task<OnboardingStatusResponse> GetStatusAsync(int userId)
    {
        var record = await repository.GetAsync(userId);
        if (record is null)
            return new OnboardingStatusResponse { IsCompleted = false, CurrentStep = 2, Draft = JsonDocument.Parse("{}").RootElement.Clone() };
        return Map(record);
    }

    public async Task<OnboardingStatusResponse> SaveDraftAsync(int userId, OnboardingDraftRequest request)
    {
        if (request.Fields.Count == 0) throw new ArgumentException("Onboarding draft cannot be empty.");
        var existing = await repository.GetAsync(userId);
        if (existing?.IsCompleted == true) throw new InvalidOperationException("Completed onboarding cannot be changed.");
        var fields = existing is null
            ? new Dictionary<string, JsonElement>(StringComparer.OrdinalIgnoreCase)
            : JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(existing.DraftJson, JsonOptions)
                ?? new Dictionary<string, JsonElement>(StringComparer.OrdinalIgnoreCase);
        foreach (var field in request.Fields) fields[field.Key] = field.Value;
        var record = new OnboardingRecord
        {
            UserId = userId,
            DraftJson = JsonSerializer.Serialize(fields, JsonOptions),
            CurrentStep = CalculateStep(fields)
        };
        await repository.UpsertDraftAsync(record);
        return Map((await repository.GetAsync(userId))!);
    }

    public async Task CompleteAsync(int userId)
    {
        var record = await repository.GetAsync(userId)
            ?? throw new InvalidOperationException("Save onboarding details before completing setup.");
        using var document = JsonDocument.Parse(record.DraftJson);
        var root = document.RootElement;
        if (!HasText(root, "businessName") || !HasText(root, "storeName") || !HasText(root, "storeCode"))
            throw new ArgumentException("Business name, store name, and store code are required to complete onboarding.");
        if (!await repository.CompleteAsync(userId))
            throw new InvalidOperationException("Onboarding has already been completed.");
    }

    private static int CalculateStep(IReadOnlyDictionary<string, JsonElement> fields)
    {
        if (fields.Keys.Any(k => k.Equals("paymentMethods", StringComparison.OrdinalIgnoreCase) || k.Equals("printerStatus", StringComparison.OrdinalIgnoreCase))) return 5;
        if (fields.Keys.Any(k => k.Equals("staff", StringComparison.OrdinalIgnoreCase))) return 4;
        if (fields.Keys.Any(k => k.Equals("storeName", StringComparison.OrdinalIgnoreCase) || k.Equals("storeCode", StringComparison.OrdinalIgnoreCase))) return 3;
        return 2;
    }

    private static bool HasText(JsonElement root, string name) =>
        root.TryGetProperty(name, out var value) && value.ValueKind == JsonValueKind.String && !string.IsNullOrWhiteSpace(value.GetString());

    private static OnboardingStatusResponse Map(OnboardingRecord record) => new()
    {
        IsCompleted = record.IsCompleted,
        CurrentStep = record.CurrentStep,
        Draft = JsonDocument.Parse(record.DraftJson).RootElement.Clone()
    };
}
