using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using Nurapos.DTOs;
using Nurapos.DTOs.Terminals;
using Nurapos.Models;
using Nurapos.Services.Interfaces;

namespace Nurapos.Controllers;

[ApiController]
[Authorize(Roles = "FRANCHISE_OWNER")]
[Route("api/terminals")]
public sealed class TerminalController(ITerminalService service) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterTerminalRequest request)
    {
        if (!TryOwnerId(out var ownerId)) return Unauthorized(Error(401, "A valid owner token is required."));
        try
        {
            var terminal = await service.RegisterAsync(request, ownerId);
            return StatusCode(201, new ApiResponse<PosTerminal> { StatusCode = 201, Message = "Terminal registered successfully.", Data = terminal });
        }
        catch (KeyNotFoundException ex) { return NotFound(Error(404, ex.Message)); }
        catch (PostgresException ex) when (ex.SqlState == "23505") { return Conflict(Error(409, "Terminal code already exists for this franchise.")); }
    }

    [HttpPost("{terminalId}/heartbeat")]
    public async Task<IActionResult> Heartbeat(string terminalId, TerminalHeartbeatRequest request)
    {
        if (!TryOwnerId(out var ownerId)) return Unauthorized(Error(401, "A valid owner token is required."));
        return await service.HeartbeatAsync(terminalId, request, ownerId)
            ? Ok(new ApiResponse<object?> { StatusCode = 200, Message = "Terminal heartbeat recorded." })
            : NotFound(Error(404, "Terminal not found."));
    }

    [HttpGet("{terminalId}/eligible-employees")]
    public async Task<IActionResult> EligibleEmployees(string terminalId)
    {
        if (!TryOwnerId(out var ownerId)) return Unauthorized(Error(401, "A valid owner token is required."));
        var employees = await service.GetEligibleEmployeesAsync(terminalId, ownerId);
        return Ok(new ApiResponse<IReadOnlyList<Employee>> { StatusCode = 200, Message = "Eligible employees fetched.", Data = employees });
    }

    private bool TryOwnerId(out int id) => int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out id);
    private static ApiResponse<object?> Error(int status, string message) => new() { StatusCode = status, Message = message };
}
