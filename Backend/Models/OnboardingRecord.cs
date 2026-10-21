namespace Nurapos.Models;

public sealed class OnboardingRecord
{
    public int UserId { get; set; }
    public string DraftJson { get; set; } = "{}";
    public int CurrentStep { get; set; } = 2;
    public bool IsCompleted { get; set; }
    public DateTime UpdatedAtUtc { get; set; }
}
