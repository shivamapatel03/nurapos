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
[Authorize(Policy = "PosPinVerified")]
[Route("api/pos/sales")]
public sealed class PosSalesController(IOwnerOperationsService service, IShiftService shiftService) : ControllerBase
{
    [HttpPost]
    [EnableRateLimiting("PosSale")]
    [DistributedRateLimit(30, 60)]
    public async Task<IActionResult> Create(SaleRequest request)
    {
        int ownerId;
        int franchiseId;
        int employeeId;
        string terminalId;

        if (User.IsInRole("FRANCHISE_OWNER") || User.IsInRole("franchise_owner") || User.HasClaim("role", "FRANCHISE_OWNER") || User.HasClaim("role", "Admin"))
        {
            var ownerVal = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("nameid") ?? User.FindFirstValue("sub") ?? User.FindFirstValue("owner_id");
            if (!int.TryParse(ownerVal, out ownerId))
                return Unauthorized(Error(401, "A valid owner session is required."));
            franchiseId = request.FranchiseId > 0 ? request.FranchiseId : 1;
            employeeId = request.PosEmployeeId ?? 1;
            terminalId = string.IsNullOrWhiteSpace(request.PosTerminalId) ? "TRM-01" : request.PosTerminalId;
        }
        else
        {
            if (!int.TryParse(User.FindFirstValue("owner_id"), out ownerId)
                || !int.TryParse(User.FindFirstValue("franchise_id"), out franchiseId)
                || !int.TryParse(User.FindFirstValue("employee_id"), out employeeId)
                || string.IsNullOrWhiteSpace(User.FindFirstValue("terminal_id")))
                return Unauthorized(Error(401, "A valid POS PIN session is required."));
            terminalId = User.FindFirstValue("terminal_id")!;
        }

        // Auto-resolve or create ShiftId if not provided
        if (string.IsNullOrWhiteSpace(request.ShiftId))
        {
            var activeShift = await shiftService.GetActiveAsync(ownerId, terminalId, employeeId);
            if (activeShift is not null)
            {
                request.ShiftId = activeShift.ShiftId;
            }
            else
            {
                request.ShiftId = $"SH-{franchiseId}-{DateTime.UtcNow:yyyyMMdd}";
            }
        }

        // Auto-generate or validate Idempotency Key
        var idempotencyKey = Request.Headers["Idempotency-Key"].ToString().Trim();
        if (string.IsNullOrWhiteSpace(idempotencyKey) || idempotencyKey.Length is < 8 or > 100)
        {
            idempotencyKey = $"sale-{DateTime.UtcNow.Ticks}-{Guid.NewGuid():N}";
        }

        request.FranchiseId = franchiseId;
        request.PosEmployeeId = employeeId;
        request.PosTerminalId = terminalId;
        request.IdempotencyKey = idempotencyKey;

        try
        {
            var sale = await service.CreateSaleAsync(request, ownerId);
            return StatusCode(201, new ApiResponse<BillRecord> { StatusCode = 201, Message = "POS sale recorded.", Data = sale });
        }
        catch (KeyNotFoundException ex) { return NotFound(Error(404, ex.Message)); }
        catch (InvalidOperationException ex) { return Conflict(Error(409, ex.Message)); }
    }

    private static ApiResponse<object?> Error(int code, string message) => new() { StatusCode = code, Message = message };
}
