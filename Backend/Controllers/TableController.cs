using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using Nurapos.DTOs;
using Nurapos.DTOs.Tables;
using Nurapos.Models;
using Nurapos.Services.Interfaces;

namespace Nurapos.Controllers;

[ApiController]
[Authorize(Roles = "FRANCHISE_OWNER,Admin,Store Manager,Shift Supervisor,Senior Cashier,Cashier,Barista")]
[Route("api/tables")]
public sealed class TableController(ITableService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int franchiseId)
    {
        if (!TryOwnerId(out var ownerId)) return Unauthorized(Error(401,"A valid owner token is required."));
        if(!User.IsInRole("FRANCHISE_OWNER")&&int.TryParse(User.FindFirstValue("franchise_id"),out var scopedFranchise))franchiseId=scopedFranchise;
        return Ok(new ApiResponse<IReadOnlyList<DiningTable>> { StatusCode=200,Message="Tables fetched successfully.",Data=await service.GetAllAsync(ownerId,franchiseId) });
    }

    [HttpPost]
    [Authorize(Roles="FRANCHISE_OWNER,Admin,Store Manager")]
    public async Task<IActionResult> Create(CreateTableRequest request)
    {
        if (!TryOwnerId(out var ownerId)) return Unauthorized(Error(401,"A valid owner token is required."));
        try { return StatusCode(201,new ApiResponse<DiningTable>{StatusCode=201,Message="Table created successfully.",Data=await service.CreateAsync(ownerId,request)}); }
        catch (KeyNotFoundException ex) { return NotFound(Error(404,ex.Message)); }
        catch (PostgresException ex) when (ex.SqlState=="23505") { return Conflict(Error(409,"Table number already exists in this franchise.")); }
    }

    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> SetStatus(int id, UpdateTableStatusRequest request)
    {
        if (!TryOwnerId(out var ownerId)) return Unauthorized(Error(401,"A valid owner token is required."));
        return await service.SetStatusAsync(ownerId,id,request)
            ? Ok(new ApiResponse<object?>{StatusCode=200,Message="Table status updated."})
            : NotFound(Error(404,"Table not found."));
    }

    [HttpPost("{id:int}/transfer")]
    public async Task<IActionResult> Transfer(int id, TransferTableRequest request)
    {
        if (!TryOwnerId(out var ownerId)) return Unauthorized(Error(401,"A valid owner token is required."));
        return await service.TransferAsync(ownerId,id,request.TargetTableId)
            ? Ok(new ApiResponse<object?>{StatusCode=200,Message="Active table order transferred."})
            : Conflict(Error(409,"Source table has no active order or target table is not vacant."));
    }

    private bool TryOwnerId(out int id)=>User.IsInRole("FRANCHISE_OWNER")
        ?int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier),out id)
        :int.TryParse(User.FindFirstValue("owner_id"),out id);
    private static ApiResponse<object?> Error(int code,string message)=>new(){StatusCode=code,Message=message};
}
