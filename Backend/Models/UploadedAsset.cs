namespace Nurapos.Models;

public sealed class UploadedAsset
{
    public int Id { get; set; }
    public int OwnerId { get; set; }
    public string Purpose { get; set; } = string.Empty;
    public string StoredName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long SizeBytes { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}
