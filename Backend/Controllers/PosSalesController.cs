using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nurapos.DTOs;
using Nurapos.DTOs.Operations;
using Nurapos.Models;
using Nurapos.Services.Interfaces;
using Microsoft.AspNetCore.RateLimiting;
using Nurapos.Middleware;

namespace Nurapos.Controllers;

[ApiController]
[Authorize(Roles="Admin,Store Manager,Shift Supervisor,Senior Cashier,Cashier,Barista",Policy="PosPinVerified")]
[Route("api/pos/sales")]
public sealed class PosSalesController(IOwnerOperationsService service):ControllerBase
{
    [HttpPost]
    [EnableRateLimiting("PosSale")]
    [DistributedRateLimit(30,60)]
    public async Task<IActionResult> Create(SaleRequest request)
    {
        if(!int.TryParse(User.FindFirstValue("owner_id"),out var ownerId)
            ||!int.TryParse(User.FindFirstValue("franchise_id"),out var franchiseId)
            ||!int.TryParse(User.FindFirstValue("employee_id"),out var employeeId)
            ||string.IsNullOrWhiteSpace(User.FindFirstValue("terminal_id")))
            return Unauthorized(Error(401,"A valid POS PIN session is required."));
        if(string.IsNullOrWhiteSpace(request.ShiftId))return BadRequest(Error(400,"An open shift ID is required."));
        var idempotencyKey=Request.Headers["Idempotency-Key"].ToString().Trim();
        if(idempotencyKey.Length is <8 or >100)return BadRequest(Error(400,"An Idempotency-Key header between 8 and 100 characters is required."));
        request.FranchiseId=franchiseId;
        request.PosEmployeeId=employeeId;
        request.PosTerminalId=User.FindFirstValue("terminal_id");
        request.IdempotencyKey=idempotencyKey;
        try
        {
            var sale=await service.CreateSaleAsync(request,ownerId);
            return StatusCode(201,new ApiResponse<BillRecord>{StatusCode=201,Message="POS sale recorded.",Data=sale});
        }
        catch(KeyNotFoundException ex){return NotFound(Error(404,ex.Message));}
        catch(InvalidOperationException ex){return Conflict(Error(409,ex.Message));}
    }
    private static ApiResponse<object?> Error(int code,string message)=>new(){StatusCode=code,Message=message};
}
