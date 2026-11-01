using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Nurapos.DTOs;
using Nurapos.DTOs.Terminals;
using Nurapos.Services.Interfaces;
using Nurapos.Middleware;

namespace Nurapos.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/pos/auth")]
public sealed class PosAuthController(ITerminalService service) : ControllerBase
{
    [HttpPost("lookup")]
    [DistributedRateLimit(30, 60)]
    public async Task<IActionResult> Lookup([FromBody] PosLookupRequest request)
    {
        if (string.IsNullOrWhiteSpace(request?.Identifier))
            return BadRequest(new ApiResponse<object?> { StatusCode = 400, Message = "Employee ID or Email is required." });

        var employee = await service.LookupEmployeeAsync(request.Identifier.Trim());
        if (employee is null)
            return NotFound(new ApiResponse<object?> { StatusCode = 404, Message = $"Employee ID or Email \"{request.Identifier.Trim()}\" does not exist." });

        return Ok(new ApiResponse<EmployeeLookupDto> { StatusCode = 200, Message = "Employee found successfully.", Data = employee });
    }

    [HttpPost("pin")]
    [EnableRateLimiting("PosPin")]
    [DistributedRateLimit(5,900)]
    public async Task<IActionResult> Pin(PosPinLoginRequest request)
    {
        try
        {
            var data = await service.AuthenticateEmployeeAsync(request);
            return Ok(new ApiResponse<PosPinLoginResponse> { StatusCode = 200, Message = "POS PIN verified.", Data = data });
        }
        catch (UnauthorizedAccessException ex) { return Unauthorized(new ApiResponse<object?> { StatusCode = 401, Message = ex.Message }); }
    }
}
