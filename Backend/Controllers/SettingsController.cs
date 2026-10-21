using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nurapos.DTOs;
using Nurapos.DTOs.Settings;
using Nurapos.Models;
using Nurapos.Services.Interfaces;

namespace Nurapos.Controllers;

[ApiController]
[Authorize(Roles="FRANCHISE_OWNER")]
[Route("api/settings")]
public sealed class SettingsController(ISettingsService service):ControllerBase
{
    [HttpGet("store")]
    public async Task<IActionResult> GetStore(){if(!OwnerId(out var id))return Unauthorized(Error(401));return Ok(new ApiResponse<StoreSettings>{StatusCode=200,Message="Store settings fetched.",Data=await service.GetStoreAsync(id)});}
    [HttpPut("store")]
    public async Task<IActionResult> SaveStore(StoreSettingsRequest request)
    {
        if(!OwnerId(out var id))return Unauthorized(Error(401));
        try{return Ok(new ApiResponse<StoreSettings>{StatusCode=200,Message="Store settings saved.",Data=await service.SaveStoreAsync(id,request)});}
        catch(ArgumentException ex){return BadRequest(new ApiResponse<object?>{StatusCode=400,Message=ex.Message});}
    }
    [HttpGet("hardware")]
    public async Task<IActionResult> GetHardware(){if(!OwnerId(out var id))return Unauthorized(Error(401));return Ok(new ApiResponse<HardwareSettings>{StatusCode=200,Message="Hardware settings fetched.",Data=await service.GetHardwareAsync(id)});}
    [HttpPut("hardware")]
    public async Task<IActionResult> SaveHardware(HardwareSettingsRequest request)
    {
        if(!OwnerId(out var id))return Unauthorized(Error(401));
        return Ok(new ApiResponse<HardwareSettings>{StatusCode=200,Message="Hardware settings saved.",Data=await service.SaveHardwareAsync(id,request)});
    }
    private bool OwnerId(out int id)=>int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier),out id);
    private static ApiResponse<object?> Error(int status)=>new(){StatusCode=status,Message="A valid owner token is required."};
}
