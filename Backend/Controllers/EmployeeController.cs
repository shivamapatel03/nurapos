using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Npgsql;
using Nurapos.DTOs;
using Nurapos.DTOs.Employees;
using Nurapos.Models;
using Nurapos.Services.Interfaces;
using Nurapos.Middleware;

namespace Nurapos.Controllers;

[ApiController]
[Authorize(Roles = "FRANCHISE_OWNER,Admin,Store Manager")]
[Route("api/employees")]
public sealed class EmployeeController(IEmployeeService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? franchiseId)
    {
        if (!TryOwnerId(out var ownerId)) return Unauthorized(Error(401, "A valid owner token is required."));
        return Ok(new ApiResponse<IReadOnlyList<Employee>> { StatusCode = 200, Message = "Employees fetched successfully.", Data = await service.GetAllAsync(ownerId, franchiseId) });
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get([FromRoute] int id)
    {
        if (!TryOwnerId(out var ownerId)) return Unauthorized(Error(401, "A valid owner token is required."));
        var employee = await service.GetAsync(ownerId, id);
        return employee is null ? NotFound(Error(404, "Employee not found.")) : Ok(new ApiResponse<Employee> { StatusCode = 200, Message = "Employee fetched successfully.", Data = employee });
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateEmployeeRequest request)
    {
        if (!TryOwnerId(out var ownerId)) return Unauthorized(Error(401, "A valid owner token is required."));
        try
        {
            var employee = await service.CreateAsync(ownerId, request);
            return StatusCode(201, new ApiResponse<Employee> { StatusCode = 201, Message = "Employee created successfully.", Data = employee });
        }
        catch (KeyNotFoundException ex) { return NotFound(Error(404, ex.Message)); }
        catch (PostgresException ex) when (ex.SqlState == "23505") { return Conflict(Error(409, "Employee code already exists for this franchise.")); }
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateEmployeeRequest request)
    {
        if (!TryOwnerId(out var ownerId)) return Unauthorized(Error(401, "A valid owner token is required."));
        return await service.UpdateAsync(ownerId, id, request)
            ? Ok(new ApiResponse<object?> { StatusCode = 200, Message = "Employee updated successfully." })
            : NotFound(Error(404, "Employee not found."));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Deactivate(int id)
    {
        if (!TryOwnerId(out var ownerId)) return Unauthorized(Error(401, "A valid owner token is required."));
        return await service.DeactivateAsync(ownerId, id)
            ? Ok(new ApiResponse<object?> { StatusCode = 200, Message = "Employee deactivated successfully." })
            : NotFound(Error(404, "Employee not found."));
    }

    [HttpPut("{id:int}/reset-pin")]
    [EnableRateLimiting("PinMutation")]
    [DistributedRateLimit(5,900)]
    public async Task<IActionResult> ResetPin(int id, ResetEmployeePinRequest request)
    {
        if (!TryOwnerId(out var ownerId)) return Unauthorized(Error(401, "A valid owner token is required."));
        return await service.ResetPinAsync(ownerId, id, request)
            ? Ok(new ApiResponse<object?> { StatusCode = 200, Message = "Employee PIN reset successfully." })
            : NotFound(Error(404, "Employee not found."));
    }

    private bool TryOwnerId(out int id) => User.IsInRole("FRANCHISE_OWNER")
        ? int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out id)
        : int.TryParse(User.FindFirstValue("owner_id"), out id);
    private static ApiResponse<object?> Error(int status, string message) => new() { StatusCode = status, Message = message };
}
