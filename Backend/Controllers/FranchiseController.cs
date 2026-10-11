using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nurapos.DTOs.Franchise;
using Nurapos.DTOs;
using Nurapos.Services.Interfaces;
using Npgsql;
using System.Security.Claims;
using System.ComponentModel.DataAnnotations;

namespace Nurapos.Controllers;

[ApiController]
[Route("api/franchises")]
public class FranchiseController : ControllerBase
{
    private readonly IFranchiseService _service;

    public FranchiseController(IFranchiseService service)
    {
        _service = service;
    }

    // =========================================================
    // CREATE FRANCHISE
    // POST: api/franchises
    // =========================================================
    [HttpPost]
    [Authorize(Roles = "FRANCHISE_OWNER", Policy = "PosPinVerified")]
    public async Task<IActionResult> Create(
        [FromForm] CreateFranchiseRequest request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized(UnauthorizedResponse());

        try
        {
            var result = await _service.CreateAsync(request, userId.Value);

            return CreatedAtAction(
                nameof(GetById),
                new { id = result.FranchiseId },
                new ApiResponse<FranchiseResponse>
                {
                    StatusCode = StatusCodes.Status201Created,
                    Message = "Franchise created successfully.",
                    Data = result
                }
            );
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new ApiResponse<object?>
            {
                StatusCode = StatusCodes.Status409Conflict,
                Message = ex.Message
            });
        }
    }


    // =========================================================
    // GET ALL FRANCHISES
    // GET: api/franchises
    // =========================================================
    [HttpGet]
    [Authorize(Roles = "FRANCHISE_OWNER", Policy = "PosPinVerified")]
    public async Task<IActionResult> GetAll()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized(UnauthorizedResponse());
        var result = await _service.GetAllAsync(userId.Value);

        return Ok(new ApiResponse<List<FranchiseResponse>>
        {
            StatusCode = StatusCodes.Status200OK,
            Message = "Franchises fetched successfully.",
            Data = result
        });
    }


    // =========================================================
    // GET FRANCHISE BY ID
    // GET: api/franchises/{id}
    // =========================================================
    [HttpGet("{id:int}")]
    [Authorize(Roles = "FRANCHISE_OWNER", Policy = "PosPinVerified")]
    public async Task<IActionResult> GetById([Range(1, int.MaxValue)] int id)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized(UnauthorizedResponse());
        try
        {
            var result = await _service.GetByIdAsync(id, userId.Value);

            if (result == null)
            {
                return NotFound(new ApiResponse<object?>
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Franchise not found."
                });
            }

            return Ok(new ApiResponse<FranchiseResponse>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Franchise fetched successfully.",
                Data = result
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


    // =========================================================
    // UPDATE FRANCHISE
    // PUT: api/franchises/{id}
    // =========================================================
    [HttpPut("{id:int}")]
    [Authorize(Roles = "FRANCHISE_OWNER", Policy = "PosPinVerified")]
    public async Task<IActionResult> Update(
        [Range(1, int.MaxValue)] int id,
        [FromBody] UpdateFranchiseRequest request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized(UnauthorizedResponse());
        try
        {
            var result =
                await _service.UpdateAsync(id, request, userId.Value);

            return Ok(new ApiResponse<FranchiseResponse>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Franchise updated successfully.",
                Data = result
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiResponse<object?>
            {
                StatusCode = StatusCodes.Status404NotFound,
                Message = ex.Message
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


    // =========================================================
    // DELETE FRANCHISE
    // DELETE: api/franchises/{id}
    // =========================================================
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "FRANCHISE_OWNER", Policy = "PosPinVerified")]
    public async Task<IActionResult> Delete([Range(1, int.MaxValue)] int id)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized(UnauthorizedResponse());
        try
        {
            await _service.DeleteAsync(id, userId.Value);

            return Ok(new ApiResponse<object?>
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Franchise deleted successfully."
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiResponse<object?>
            {
                StatusCode = StatusCodes.Status404NotFound,
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
        catch (PostgresException ex)
            when (ex.SqlState == "23503")
        {
            return Conflict(new ApiResponse<object?>
            {
                StatusCode = StatusCodes.Status409Conflict,
                Message = "This franchise cannot be deleted because it is already being used by other records."
            });
        }
    }

    private int? GetUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(userId, out var parsedUserId) ? parsedUserId : null;
    }

    private static ApiResponse<object?> UnauthorizedResponse() => new()
    {
        StatusCode = StatusCodes.Status401Unauthorized,
        Message = "A valid authenticated owner is required."
    };
}
