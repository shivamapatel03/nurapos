using Nurapos.DTOs.Auth;
using Nurapos.DTOs;
using Nurapos.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Nurapos.Middleware;

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
    [HttpPost("register")]
    [DistributedRateLimit(5,60)]
    public async Task<IActionResult> Signup([FromBody] SignupRequest request)
    {
        try
        {
            var data = await _authService.RegisterAsync(request);
            return StatusCode(StatusCodes.Status201Created, new ApiResponse<RegisterResponse>
            {
                StatusCode = 201, Message = "Verification code sent.", Data = data
            });
        }
        catch (InvalidOperationException ex) when (ex.Message == "Email already registered.")
        {
            return Conflict(new ApiResponse<object?> { StatusCode = 409, Message = ex.Message });
        }
        catch (InvalidOperationException)
        {
            return StatusCode(503, new ApiResponse<object?> { StatusCode = 503, Message = "Account verification is temporarily unavailable. Please retry shortly." });
        }
        catch (Npgsql.NpgsqlException ex) when (ex.SqlState == "23505")
        {
            return Conflict(new ApiResponse<object?> { StatusCode = 409, Message = "Email already registered." });
        }
    }

    [HttpPost("verify-email")]
    [DistributedRateLimit(5,600)]
    public async Task<IActionResult> VerifyEmail([FromBody] EmailCodeRequest request)
    {
        try
        {
            var session = await _authService.VerifyEmailAsync(request);
            return Ok(new ApiResponse<EmailVerificationResponse>
            {
                StatusCode = 200, Message = "Email verified successfully.",
                Data = new EmailVerificationResponse { IsVerified = true, Session = session }
            });
        }
        catch (KeyNotFoundException ex) { return NotFound(new ApiResponse<object?> { StatusCode = 404, Message = ex.Message }); }
        catch (InvalidOperationException ex) { return Conflict(new ApiResponse<object?> { StatusCode = 409, Message = ex.Message }); }
        catch (UnauthorizedAccessException ex) { return BadRequest(new ApiResponse<object?> { StatusCode = 400, Message = ex.Message }); }
    }

    [HttpPost("resend-verification")]
    [EnableRateLimiting("OtpResend")]
    [DistributedRateLimit(3,600)]
    public async Task<IActionResult> ResendVerification([FromBody] EmailRequest request)
    {
        await _authService.ResendVerificationAsync(request);
        return Ok(new ApiResponse<object?> { StatusCode = 200, Message = "If this email is awaiting verification, a code has been sent." });
    }

    [HttpPost("password/forgot")]
    [EnableRateLimiting("PasswordForgot")]
    [DistributedRateLimit(5,900)]
    public async Task<IActionResult> ForgotPassword([FromBody] EmailRequest request)
    {
        await _authService.ForgotPasswordAsync(request);
        return Ok(new ApiResponse<object?> { StatusCode = 200, Message = "If this email is registered, a 4-digit reset code has been sent." });
    }

    [HttpPost("password/verify-code")]
    [DistributedRateLimit(5,600)]
    public async Task<IActionResult> VerifyPasswordCode([FromBody] EmailCodeRequest request)
    {
        try
        {
            var token = await _authService.VerifyPasswordResetCodeAsync(request);
            return Ok(new ApiResponse<object> { StatusCode = 200, Message = "Reset code verified.", Data = new { resetToken = token } });
        }
        catch (InvalidOperationException ex) { return Conflict(new ApiResponse<object?> { StatusCode = 409, Message = ex.Message }); }
        catch (UnauthorizedAccessException ex) { return BadRequest(new ApiResponse<object?> { StatusCode = 400, Message = ex.Message }); }
    }

    [HttpPost("password/reset")]
    [DistributedRateLimit(5,900)]
    public async Task<IActionResult> ResetPassword([FromBody] PasswordResetRequest request)
    {
        try
        {
            await _authService.ResetPasswordAsync(request);
            return Ok(new ApiResponse<object?> { StatusCode = 200, Message = "Password updated successfully. Please sign in with your new credentials." });
        }
        catch (UnauthorizedAccessException ex) { return BadRequest(new ApiResponse<object?> { StatusCode = 400, Message = ex.Message }); }
        catch (InvalidOperationException ex) { return Conflict(new ApiResponse<object?> { StatusCode = 409, Message = ex.Message }); }
    }

    [HttpPost("login")]
    [DistributedRateLimit(5,60)]
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
    [DistributedRateLimit(20,60)]
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
