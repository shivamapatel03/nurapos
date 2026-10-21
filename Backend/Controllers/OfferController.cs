using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using Nurapos.DTOs;
using Nurapos.DTOs.Offers;
using Nurapos.Models;
using Nurapos.Services.Interfaces;

namespace Nurapos.Controllers;

[ApiController]
[Authorize]
[Route("api/offers")]
public sealed class OfferController(IOfferService service):ControllerBase
{
    [HttpGet]
    [Authorize(Roles="FRANCHISE_OWNER,Admin,Store Manager,Shift Supervisor,Senior Cashier,Cashier,Barista")]
    public async Task<IActionResult> Get([FromQuery]int franchiseId)
    {
        if(!TryOwnerId(out var ownerId))return Unauthorized(Error(401,"A valid owner or POS session is required."));
        if(!User.IsInRole("FRANCHISE_OWNER")&&int.TryParse(User.FindFirstValue("franchise_id"),out var scopedFranchise))franchiseId=scopedFranchise;
        return Ok(new ApiResponse<IReadOnlyList<Offer>>{StatusCode=200,Message="Active offers fetched.",Data=await service.GetAllAsync(ownerId,franchiseId)});
    }
    [HttpPost]
    [Authorize(Roles="FRANCHISE_OWNER,Admin,Store Manager")]
    public async Task<IActionResult> Create(CreateOfferRequest request)
    {
        if(!TryOwnerId(out var ownerId))return Unauthorized(Error(401,"A valid owner token is required."));
        try{return StatusCode(201,new ApiResponse<Offer>{StatusCode=201,Message="Offer created.",Data=await service.CreateAsync(ownerId,request)});}
        catch(ArgumentException ex){return BadRequest(Error(400,ex.Message));}
        catch(KeyNotFoundException ex){return NotFound(Error(404,ex.Message));}
        catch(PostgresException ex)when(ex.SqlState=="23505"){return Conflict(Error(409,"Offer code already exists in this franchise."));}
    }
    private bool TryOwnerId(out int id)=>User.IsInRole("FRANCHISE_OWNER")
        ?int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier),out id)
        :int.TryParse(User.FindFirstValue("owner_id"),out id);
    private static ApiResponse<object?> Error(int code,string message)=>new(){StatusCode=code,Message=message};
}

[ApiController]
[Authorize(Roles="FRANCHISE_OWNER,Admin,Store Manager,Shift Supervisor,Senior Cashier,Cashier,Barista")]
[Route("api/discounts")]
public sealed class DiscountController(IOfferService service):ControllerBase
{
    [HttpPost("validate-code")]
    public async Task<IActionResult> Validate(ValidateDiscountCodeRequest request)
    {
        if(!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier),out var ownerId))return Unauthorized(new ApiResponse<object?>{StatusCode=401,Message="A valid owner token is required."});
        if(!User.IsInRole("FRANCHISE_OWNER"))
        {
            if(!int.TryParse(User.FindFirstValue("owner_id"),out ownerId)||!int.TryParse(User.FindFirstValue("franchise_id"),out var franchiseId))
                return Unauthorized(new ApiResponse<object?>{StatusCode=401,Message="A valid POS session is required."});
            request.FranchiseId=franchiseId;
        }
        return Ok(new ApiResponse<DiscountValidationResponse>{StatusCode=200,Message="Discount code checked.",Data=await service.ValidateCodeAsync(ownerId,request)});
    }
}
