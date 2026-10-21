using Nurapos.Models;

namespace Nurapos.Repositories.Interfaces;

public interface IUploadRepository
{
    Task EnsureSchemaAsync();
    Task<UploadedAsset> CreateAsync(UploadedAsset asset);
    Task<UploadedAsset?> GetAsync(int ownerId,int assetId);
}
