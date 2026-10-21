using Microsoft.AspNetCore.Http;
using Nurapos.Models;

namespace Nurapos.Services.Interfaces;

public interface IUploadService
{
    Task<UploadedAsset> UploadAsync(int ownerId,IFormFile file,string purpose,CancellationToken cancellationToken);
    Task<(UploadedAsset Asset,Stream Content)?> OpenAsync(int ownerId,int assetId,CancellationToken cancellationToken);
}
