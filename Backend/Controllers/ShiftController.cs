using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using Nurapos.DTOs;
using Nurapos.DTOs.Shifts;
using Nurapos.Models;
using Nurapos.Services.Interfaces;

namespace Nurapos.Controllers;

[ApiController]
[Authorize(Roles = "FRANCHISE_OWNER,Admin,Store Manager,Shift Supervisor,Senior Cashier,Cashier,Barista,Inventory Clerk,Kitchen Lead")]
[Route("api/shifts")]
public sealed class ShiftController(IShiftService service) : ControllerBase
{
    [HttpPost("open")]
    public async Task<IActionResult> Open(OpenShiftRequest request)
    {
        if (!TryScope(out var ownerId, out var employeeId, out var terminalId, out var franchiseId)) return Unauthorized(Error(401, "Valid owner or POS session authentication is required."));
        if (employeeId.HasValue)
        {
            request = new OpenShiftRequest
            {
                TerminalId = terminalId!, FranchiseId = franchiseId!.Value, CashierId = employeeId.Value,
                OpeningFloat = request.OpeningFloat, Notes = request.Notes
            };
        }
        try
        {
            var shift = await service.OpenAsync(ownerId, request);
            return StatusCode(201, new ApiResponse<RegisterShift> { StatusCode = 201, Message = "Shift opened.", Data = shift });
        }
        catch (KeyNotFoundException ex) { return NotFound(Error(404, ex.Message)); }
        catch (PostgresException ex) when (ex.SqlState == "23505") { return Conflict(Error(409, "An open shift already exists for this terminal.")); }
    }

    [HttpGet("active")]
    public async Task<IActionResult> Active([FromQuery] string? terminalId, [FromQuery] int? cashierId)
    {
        if (!TryScope(out var ownerId, out var employeeId, out var terminalClaim, out _)) return Unauthorized(Error(401, "Valid owner or POS session authentication is required."));
        if (employeeId.HasValue) { terminalId = terminalClaim; cashierId = employeeId; }
        var shift = await service.GetActiveAsync(ownerId, terminalId ?? string.Empty, cashierId);
        return Ok(new ApiResponse<RegisterShift?> { StatusCode = 200, Message = "Active shift fetched.", Data = shift });
    }

    [HttpPost("cash-movement")]
    public async Task<IActionResult> CashMovement(CashMovementRequest request)
    {
        if (!TryScope(out var ownerId, out var employeeId, out var terminalId, out _)) return Unauthorized(Error(401, "Valid owner or POS session authentication is required."));
        return await service.AddCashMovementAsync(ownerId, request, employeeId, terminalId)
            ? Ok(new ApiResponse<object?> { StatusCode = 200, Message = "Cash movement recorded." })
            : NotFound(Error(404, "Open shift not found."));
    }

    [HttpPost("close")]
    public async Task<IActionResult> Close(CloseShiftRequest request)
    {
        if (!TryScope(out var ownerId, out var employeeId, out var terminalId, out _)) return Unauthorized(Error(401, "Valid owner or POS session authentication is required."));
        var result = await service.CloseAsync(ownerId, request, employeeId, terminalId);
        return result is null ? Conflict(Error(409, "Open shift not found or already closed."))
            : Ok(new ApiResponse<ShiftCloseResponse> { StatusCode = 200, Message = "Shift closed.", Data = result });
    }

    private bool TryScope(out int ownerId,out int? employeeId,out string? terminalId,out int? franchiseId)
    {
        employeeId=null;terminalId=null;franchiseId=null;
        if(User.IsInRole("FRANCHISE_OWNER"))return int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier),out ownerId);
        var employee=0;var franchise=0;
        var success=int.TryParse(User.FindFirstValue("owner_id"),out ownerId)
            &&int.TryParse(User.FindFirstValue("employee_id"),out employee)
            &&int.TryParse(User.FindFirstValue("franchise_id"),out franchise);
        if(!success)return false;
        employeeId=employee;franchiseId=franchise;terminalId=User.FindFirstValue("terminal_id");return !string.IsNullOrWhiteSpace(terminalId);
    }
    private static ApiResponse<object?> Error(int status, string message) => new() { StatusCode = status, Message = message };
}
