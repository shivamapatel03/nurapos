using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nurapos.DTOs;
using Nurapos.DTOs.Uploads;
using Nurapos.Services.Interfaces;

namespace Nurapos.Controllers;

[ApiController]
[Authorize]
[Route("api/upload")]
public sealed class UploadController(IUploadService service):ControllerBase
{
    [HttpPost("product-image")]
    [Authorize(Roles="FRANCHISE_OWNER,Admin,Store Manager")]
    [RequestSizeLimit(5*1024*1024+65536)]
    public Task<IActionResult> ProductImage([FromForm]UploadFileRequest request,CancellationToken cancellationToken)=>Upload(request,"product-image",cancellationToken);

    [HttpPost("receipt")]
    [Authorize(Roles="FRANCHISE_OWNER,Admin,Store Manager,Shift Supervisor,Senior Cashier,Cashier")]
    [RequestSizeLimit(10*1024*1024+65536)]
    public Task<IActionResult> Receipt([FromForm]UploadFileRequest request,CancellationToken cancellationToken)=>Upload(request,"receipt",cancellationToken);

    [HttpGet("files/{id:int}")]
    public async Task<IActionResult> GetFile(int id,CancellationToken cancellationToken)
    {
        if(!TryOwnerId(out var ownerId))return Unauthorized(Error(401,"A valid owner token is required."));
        var result=await service.OpenAsync(ownerId,id,cancellationToken);
        return result is null?NotFound(Error(404,"File not found.")):File(result.Value.Content,result.Value.Asset.ContentType);
    }

    private async Task<IActionResult> Upload(UploadFileRequest request,string purpose,CancellationToken cancellationToken)
    {
        if(!TryOwnerId(out var ownerId))return Unauthorized(Error(401,"A valid owner token is required."));
        try
        {
            var asset=await service.UploadAsync(ownerId,request.File,purpose,cancellationToken);
            return StatusCode(201,new ApiResponse<UploadResponse>{StatusCode=201,Message="File uploaded successfully.",Data=new UploadResponse{Url=$"/api/upload/files/{asset.Id}"}});
        }
        catch(ArgumentException ex){return BadRequest(Error(400,ex.Message));}
    }
    private bool TryOwnerId(out int id)=>User.IsInRole("FRANCHISE_OWNER")
        ?int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier),out id)
        :int.TryParse(User.FindFirstValue("owner_id"),out id);
    private static ApiResponse<object?> Error(int status,string message)=>new(){StatusCode=status,Message=message};
}
