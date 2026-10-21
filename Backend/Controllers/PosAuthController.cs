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
