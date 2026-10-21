using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Nurapos.DTOs.Uploads;

public sealed class UploadFileRequest
{
    [Required] public IFormFile File { get; set; } = null!;
}

public sealed class UploadResponse
{
    public string Url { get; init; } = string.Empty;
}
