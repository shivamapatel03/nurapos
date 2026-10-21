using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nurapos.DTOs;
using Nurapos.DTOs.Onboarding;
using Nurapos.Services.Interfaces;
using Npgsql;

namespace Nurapos.Controllers;

[ApiController]
[Authorize(Roles = "FRANCHISE_OWNER")]
[Route("api/onboarding")]
public sealed class OnboardingController(IOnboardingService service) : ControllerBase
{
    [HttpGet("status")]
    public async Task<IActionResult> GetStatus()
    {
        if (!TryUserId(out var userId)) return Unauthorized(Error(401, "Valid owner authentication is required."));
        return Ok(new ApiResponse<OnboardingStatusResponse> { StatusCode = 200, Message = "Onboarding status fetched.", Data = await service.GetStatusAsync(userId) });
    }

    [HttpPut("draft")]
    public async Task<IActionResult> SaveDraft(OnboardingDraftRequest request)
    {
        if (!TryUserId(out var userId)) return Unauthorized(Error(401, "Valid owner authentication is required."));
        try
        {
            return Ok(new ApiResponse<OnboardingStatusResponse> { StatusCode = 200, Message = "Onboarding draft saved.", Data = await service.SaveDraftAsync(userId, request) });
        }
        catch (ArgumentException ex) { return BadRequest(Error(400, ex.Message)); }
        catch (InvalidOperationException ex) { return Conflict(Error(409, ex.Message)); }
    }

    [HttpPost("complete")]
    public async Task<IActionResult> Complete()
    {
        if (!TryUserId(out var userId)) return Unauthorized(Error(401, "Valid owner authentication is required."));
        try
        {
            await service.CompleteAsync(userId);
            return Ok(new ApiResponse<object> { StatusCode = 200, Message = "Onboarding completed.", Data = new { isCompleted = true } });
        }
        catch (ArgumentException ex) { return BadRequest(Error(400, ex.Message)); }
        catch (InvalidOperationException ex) { return Conflict(Error(409, ex.Message)); }
        catch (PostgresException ex) when (ex.SqlState == "23505") { return Conflict(Error(409, "Store code or employee code already exists.")); }
    }

    private bool TryUserId(out int id) => int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out id);
    private static ApiResponse<object?> Error(int status, string message) => new() { StatusCode = status, Message = message };
}
