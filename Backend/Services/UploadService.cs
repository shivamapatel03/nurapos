using Microsoft.AspNetCore.Http;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;
using Nurapos.Services.Interfaces;

namespace Nurapos.Services;

public sealed class UploadService(IUploadRepository repository,IFileStorage storage):IUploadService
{
    public async Task<UploadedAsset> UploadAsync(int ownerId,IFormFile file,string purpose,CancellationToken cancellationToken)
    {
        var isImage=purpose=="product-image";
        var maxSize=isImage?5L*1024*1024:10L*1024*1024;
        if(file.Length<=0||file.Length>maxSize)throw new ArgumentException($"File size must be between 1 byte and {maxSize/(1024*1024)} MB.");
        if(!TryContentType(file,out var contentType,out var extension,isImage))throw new ArgumentException("File type is not allowed.");
        await using var input=file.OpenReadStream();
        var bytes=new byte[12];var read=await input.ReadAsync(bytes.AsMemory(0,bytes.Length),cancellationToken);
        if(!HasExpectedSignature(bytes.AsSpan(0,read),contentType))throw new ArgumentException("File contents do not match the declared file type.");
        input.Position=0;
        var storedName=$"{Guid.NewGuid():N}{extension}";
        await storage.SaveAsync(storedName,input,cancellationToken);
        try
        {
            return await repository.CreateAsync(new UploadedAsset{OwnerId=ownerId,Purpose=purpose,StoredName=storedName,ContentType=contentType,SizeBytes=file.Length});
        }
        catch { await storage.DeleteAsync(storedName);throw; }
    }

    public async Task<(UploadedAsset Asset,Stream Content)?> OpenAsync(int ownerId,int assetId,CancellationToken cancellationToken)
    {
        var asset=await repository.GetAsync(ownerId,assetId);if(asset is null)return null;
        var stream=await storage.OpenReadAsync(asset.StoredName,cancellationToken);return stream is null?null:(asset,stream);
    }

    private static bool TryContentType(IFormFile file,out string contentType,out string extension,bool imageOnly)
    {
        (contentType,extension)=file.ContentType.ToLowerInvariant() switch
        {
            "image/jpeg"=>("image/jpeg",".jpg"),"image/png"=>("image/png",".png"),"image/webp"=>("image/webp",".webp"),
            "application/pdf" when !imageOnly=>("application/pdf",".pdf"),_=> (string.Empty,string.Empty)
        };
        return !string.IsNullOrEmpty(contentType);
    }
    private static bool HasExpectedSignature(ReadOnlySpan<byte> b,string type)=>type switch
    {
        "image/jpeg"=>b.Length>=3&&b[0]==0xff&&b[1]==0xd8&&b[2]==0xff,
        "image/png"=>b.Length>=8&&b[..8].SequenceEqual(new byte[]{137,80,78,71,13,10,26,10}),
        "image/webp"=>b.Length>=12&&b[..4].SequenceEqual("RIFF"u8)&&b.Slice(8,4).SequenceEqual("WEBP"u8),
        "application/pdf"=>b.Length>=5&&b[..5].SequenceEqual("%PDF-"u8),_=>false
    };
}
