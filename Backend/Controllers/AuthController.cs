using Nurapos.DTOs.Auth;
using Nurapos.DTOs;
using Nurapos.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Nurapos.Controllers;

[ApiController]
[Route("api/auth")]
[EnableRateLimiting("Auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("signup")]
    public async Task<IActionResult> Signup(
        [FromBody] SignupRequest request)
    {
        try
        {
            var response =
                await _authService.SignupAsync(request);

            return StatusCode(StatusCodes.Status201Created,
                new ApiResponse<AuthResponse>
                {
                    StatusCode = StatusCodes.Status201Created,
                    Message = "Account created successfully.",
                    Data = response
                });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new ApiResponse<object?>
            {
                StatusCode = StatusCodes.Status409Conflict,
                Message = ex.Message
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse<object?>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                Message = ex.Message
            });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest request)
    {
        try
        {
            var response =
                await _authService.LoginAsync(request);

            return Ok(new ApiResponse<AuthResponse>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Login successful.",
                Data = response
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new ApiResponse<object?>
            {
                StatusCode = StatusCodes.Status401Unauthorized,
                Message = ex.Message
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse<object?>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                Message = ex.Message
            });
        }
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(
        [FromBody] RefreshTokenRequest request)
    {
        try
        {
            return Ok(new ApiResponse<AuthResponse>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Tokens refreshed successfully.",
                Data = await _authService.RefreshAsync(request.RefreshToken)
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new ApiResponse<object?>
            {
                StatusCode = StatusCodes.Status401Unauthorized,
                Message = ex.Message
            });
        }
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout(
        [FromBody] RefreshTokenRequest request)
    {
        await _authService.RevokeRefreshTokenAsync(request.RefreshToken);
        return Ok(new ApiResponse<object?>
        {
            StatusCode = StatusCodes.Status200OK,
            Message = "Refresh token revoked successfully."
        });
    }

    [Authorize(Roles = "FRANCHISE_OWNER")]
    [HttpPost("pos-pin/setup")]
    public async Task<IActionResult> SetupPosPin([FromBody] PosPinRequest request)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized(Error(401, "A valid owner token is required."));
        try
        {
            await _authService.SetupPosPinAsync(userId, request.Pin);
            return Ok(new ApiResponse<object?>
            {
                StatusCode = 200,
                Message = "POS PIN configured. Verify your PIN to unlock POS access."
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(Error(409, ex.Message));
        }
    }

    [Authorize(Roles = "FRANCHISE_OWNER")]
    [HttpPost("pos-pin/verify")]
    public async Task<IActionResult> VerifyPosPin([FromBody] PosPinRequest request)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized(Error(401, "A valid owner token is required."));
        try
        {
            var token = await _authService.VerifyPosPinAsync(userId, request.Pin);
            return Ok(new ApiResponse<PosPinTokenResponse>
            {
                StatusCode = 200,
                Message = "POS PIN verified. Use this access token for POS endpoints.",
                Data = token
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(Error(401, ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(Error(400, ex.Message));
        }
    }

    private bool TryGetUserId(out int userId) =>
        int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out userId);

    private static ApiResponse<object?> Error(int statusCode, string message) => new()
    {
        StatusCode = statusCode,
        Message = message
    };
}
