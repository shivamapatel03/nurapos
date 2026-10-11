using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using Nurapos.DTOs;
using Nurapos.DTOs.Operations;
using Nurapos.Services.Interfaces;
using Nurapos.Filters;

namespace Nurapos.Controllers;

[ApiController]
[Authorize(Roles = "FRANCHISE_OWNER", Policy = "PosPinVerified")]
[Route("api/owner")]
public sealed class OwnerOperationsController : ControllerBase
{
    private readonly IOwnerOperationsService _service;
    public OwnerOperationsController(IOwnerOperationsService service) => _service = service;

    [HttpGet("payment-modes")]
    public async Task<IActionResult> GetPaymentModes()
    {
        var ownerId = CurrentOwnerId();
        if (ownerId == null) return Unauthorized(Error(401, "A valid owner token is required."));
        return Ok(new ApiResponse<object>
        {
            StatusCode = 200,
            Message = "Payment modes fetched successfully.",
            Data = await _service.GetPaymentModesAsync(ownerId.Value)
        });
    }

    [HttpPost("payment-modes")]
    public async Task<IActionResult> CreatePaymentMode(PaymentModeRequest request)
    {
        var ownerId = CurrentOwnerId();
        if (ownerId == null) return Unauthorized(Error(401, "A valid owner token is required."));
        try
        {
            return StatusCode(201, new ApiResponse<object>
            {
                StatusCode = 201,
                Message = "Payment mode created successfully.",
                Data = await _service.CreatePaymentModeAsync(request, ownerId.Value)
            });
        }
        catch (PostgresException ex) when (ex.SqlState == "23505")
        {
            return Conflict(Error(409, "This payment mode already exists for your account."));
        }
    }

    [HttpPost("expenses")]
    public async Task<IActionResult> CreateExpense(ExpenseRequest request)
    {
        var ownerId = CurrentOwnerId();
        if (ownerId == null) return Unauthorized(Error(401, "A valid owner token is required."));
        try
        {
            return StatusCode(201, new ApiResponse<object>
            {
                StatusCode = 201,
                Message = "Expense recorded successfully.",
                Data = await _service.CreateExpenseAsync(request, ownerId.Value)
            });
        }
        catch (KeyNotFoundException ex) { return NotFound(Error(404, ex.Message)); }
        catch (PostgresException ex) when (ex.SqlState is "23503" or "23514") { return Conflict(Error(409, "Expense could not be recorded because a related value is invalid.")); }
    }

    [HttpGet("expenses")]
    public async Task<IActionResult> GetExpenses([FromQuery, Range(1, int.MaxValue)] int? franchiseId = null)
    {
        var ownerId = CurrentOwnerId();
        if (ownerId == null) return Unauthorized(Error(401, "A valid owner token is required."));
        return Ok(new ApiResponse<object>
        {
            StatusCode = 200,
            Message = "Expenses fetched successfully.",
            Data = await _service.GetExpensesAsync(ownerId.Value, franchiseId)
        });
    }

    [HttpPost("sales")]
    public async Task<IActionResult> CreateSale(SaleRequest request)
    {
        var ownerId = CurrentOwnerId();
        if (ownerId == null) return Unauthorized(Error(401, "A valid owner token is required."));
        try
        {
            return StatusCode(201, new ApiResponse<object>
            {
                StatusCode = 201,
                Message = "Sale bill generated successfully. Generated bills cannot be edited or deleted.",
                Data = await _service.CreateSaleAsync(request, ownerId.Value)
            });
        }
        catch (KeyNotFoundException ex) { return NotFound(Error(404, ex.Message)); }
        catch (InvalidOperationException ex) { return Conflict(Error(409, ex.Message)); }
        catch (PostgresException ex) when (ex.SqlState is "23503" or "23514") { return Conflict(Error(409, "Sale could not be completed because related records or stock are invalid.")); }
    }

    [HttpGet("sales")]
    public async Task<IActionResult> GetSales([FromQuery, Range(1, int.MaxValue)] int? franchiseId = null)
    {
        var ownerId = CurrentOwnerId();
        if (ownerId == null) return Unauthorized(Error(401, "A valid owner token is required."));
        return Ok(new ApiResponse<object>
        {
            StatusCode = 200,
            Message = "Sales fetched successfully.",
            Data = await _service.GetSalesAsync(ownerId.Value, franchiseId)
        });
    }

    [HttpGet("sales/{id:int}")]
    public async Task<IActionResult> GetSale([Range(1, int.MaxValue)] int id)
    {
        var ownerId = CurrentOwnerId();
        if (ownerId == null) return Unauthorized(Error(401, "A valid owner token is required."));
        var result = await _service.GetSaleAsync(id, ownerId.Value);
        return result == null ? NotFound(Error(404, "Sale not found.")) : Ok(new ApiResponse<object> { StatusCode = 200, Message = "Sale fetched successfully.", Data = result });
    }

    [HttpPost("purchases")]
    public async Task<IActionResult> CreatePurchase(PurchaseRequest request)
    {
        var ownerId = CurrentOwnerId();
        if (ownerId == null) return Unauthorized(Error(401, "A valid owner token is required."));
        try
        {
            return StatusCode(201, new ApiResponse<object>
            {
                StatusCode = 201,
                Message = "Purchase bill generated successfully. Generated bills cannot be edited or deleted.",
                Data = await _service.CreatePurchaseAsync(request, ownerId.Value)
            });
        }
        catch (KeyNotFoundException ex) { return NotFound(Error(404, ex.Message)); }
        catch (PostgresException ex) when (ex.SqlState is "23503" or "23514") { return Conflict(Error(409, "Purchase could not be completed because related records are invalid.")); }
    }

    [HttpGet("purchases")]
    public async Task<IActionResult> GetPurchases([FromQuery, Range(1, int.MaxValue)] int? franchiseId = null)
    {
        var ownerId = CurrentOwnerId();
        if (ownerId == null) return Unauthorized(Error(401, "A valid owner token is required."));
        return Ok(new ApiResponse<object>
        {
            StatusCode = 200,
            Message = "Purchases fetched successfully.",
            Data = await _service.GetPurchasesAsync(ownerId.Value, franchiseId)
        });
    }

    [HttpGet("purchases/{id:int}")]
    public async Task<IActionResult> GetPurchase([Range(1, int.MaxValue)] int id)
    {
        var ownerId = CurrentOwnerId();
        if (ownerId == null) return Unauthorized(Error(401, "A valid owner token is required."));
        var result = await _service.GetPurchaseAsync(id, ownerId.Value);
        return result == null ? NotFound(Error(404, "Purchase not found.")) : Ok(new ApiResponse<object> { StatusCode = 200, Message = "Purchase fetched successfully.", Data = result });
    }

    [HttpGet("franchises/{franchiseId:int}/products")]
    public async Task<IActionResult> GetInventory([Range(1, int.MaxValue)] int franchiseId)
    {
        var ownerId = CurrentOwnerId();
        if (ownerId == null) return Unauthorized(Error(401, "A valid owner token is required."));
        return Ok(new ApiResponse<object>
        {
            StatusCode = 200,
            Message = "Franchise inventory fetched successfully.",
            Data = await _service.GetInventoryAsync(franchiseId, ownerId.Value)
        });
    }

    [HttpPut("franchises/{franchiseId:int}/products/{productId:int}")]
    public async Task<IActionResult> SetInventory(
        [Range(1, int.MaxValue)] int franchiseId,
        [Range(1, int.MaxValue)] int productId,
        FranchiseProductRequest request)
    {
        var ownerId = CurrentOwnerId();
        if (ownerId == null) return Unauthorized(Error(401, "A valid owner token is required."));
        try
        {
            var item = await _service.SetInventoryAsync(franchiseId, productId, request, ownerId.Value);
            return item == null
                ? NotFound(Error(404, "Franchise or product was not found for this owner."))
                : Ok(new ApiResponse<object> { StatusCode = 200, Message = "Franchise inventory updated successfully.", Data = item });
        }
        catch (PostgresException ex) when (ex.SqlState is "23503" or "23514")
        {
            return Conflict(Error(409, "Inventory could not be updated because related values are invalid."));
        }
    }

    [HttpGet("payments")]
    public async Task<IActionResult> GetPayments([FromQuery, Range(1, int.MaxValue)] int? franchiseId = null)
    {
        var ownerId = CurrentOwnerId();
        if (ownerId == null) return Unauthorized(Error(401, "A valid owner token is required."));
        return Ok(new ApiResponse<object>
        {
            StatusCode = 200,
            Message = "Payments fetched successfully.",
            Data = await _service.GetPaymentsAsync(ownerId.Value, franchiseId)
        });
    }

    [HttpGet("daily-summaries")]
    public async Task<IActionResult> GetDailySummaries([FromQuery, Range(1, int.MaxValue)] int? franchiseId = null)
    {
        var ownerId = CurrentOwnerId();
        if (ownerId == null) return Unauthorized(Error(401, "A valid owner token is required."));
        return Ok(new ApiResponse<object>
        {
            StatusCode = 200,
            Message = "Daily summaries fetched successfully.",
            Data = await _service.GetDailySummariesAsync(ownerId.Value, franchiseId)
        });
    }

    private int? CurrentOwnerId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(value, out var id) ? id : null;
    }

    private static ApiResponse<object?> Error(int statusCode, string message) => new() { StatusCode = statusCode, Message = message };
}
