using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using Nurapos.DTOs;
using Nurapos.DTOs.Customers;
using Nurapos.Models;
using Nurapos.Services.Interfaces;

namespace Nurapos.Controllers;

[ApiController]
[Authorize(Roles = "FRANCHISE_OWNER,Admin,Store Manager,Shift Supervisor,Senior Cashier,Cashier,Barista")]
[Route("api/customers")]
public sealed class CustomerController(ICustomerService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] string? name)
    {
        if (!TryOwnerId(out var ownerId)) return Unauthorized(Error(401, "A valid owner token is required."));
        return Ok(new ApiResponse<IReadOnlyList<Customer>> { StatusCode = 200, Message = "Customers fetched successfully.", Data = await service.GetAllAsync(ownerId, search, name) });
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateCustomerRequest request)
    {
        if (!TryOwnerId(out var ownerId)) return Unauthorized(Error(401, "A valid owner token is required."));
        try
        {
            return StatusCode(201, new ApiResponse<Customer> { StatusCode = 201, Message = "Customer created successfully.", Data = await service.CreateAsync(ownerId, request) });
        }
        catch (PostgresException ex) when (ex.SqlState == "23505") { return Conflict(Error(409, "A customer with this phone number already exists.")); }
    }

    [HttpPost("{id:int}/loyalty/redeem")]
    public async Task<IActionResult> Redeem(int id, LoyaltyRedeemRequest request)
    {
        if (!TryOwnerId(out var ownerId)) return Unauthorized(Error(401, "A valid owner token is required."));
        var result = await service.RedeemAsync(ownerId, id, request);
        return result is null
            ? Conflict(Error(409, "Customer was not found or has insufficient loyalty points."))
            : Ok(new ApiResponse<LoyaltyRedeemResponse> { StatusCode = 200, Message = "Loyalty points redeemed.", Data = new LoyaltyRedeemResponse { DiscountAmount = result.DiscountAmount, RemainingPoints = result.RemainingPoints } });
    }

    private bool TryOwnerId(out int id) => User.IsInRole("FRANCHISE_OWNER")
        ? int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out id)
        : int.TryParse(User.FindFirstValue("owner_id"), out id);
    private static ApiResponse<object?> Error(int status, string message) => new() { StatusCode = status, Message = message };
}
