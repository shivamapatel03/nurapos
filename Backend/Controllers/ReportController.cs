using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nurapos.DTOs;
using Nurapos.DTOs.Reports;
using Nurapos.Models;
using Nurapos.Services.Interfaces;

namespace Nurapos.Controllers;

[ApiController]
[Authorize]
[Route("api/reports")]
public sealed class ReportController(IReportService service) : ControllerBase
{
    [HttpGet("sales-tax")]
    public Task<IActionResult> SalesTax([FromQuery] ReportRangeRequest range) =>
        Run(async id => await service.SalesTaxAsync(id, range), "Sales tax report generated.");

    [HttpGet("profit-loss")]
    public Task<IActionResult> ProfitLoss([FromQuery] ReportRangeRequest range) =>
        Run(async id => await service.ProfitLossAsync(id, range), "Profit and loss report generated.");

    [HttpGet("z-report")]
    public Task<IActionResult> ZReport([FromQuery] ReportRangeRequest range) =>
        Run(async id => await service.ZReportsAsync(id, range), "Z reports fetched.");

    [HttpGet("inventory-valuation")]
    public Task<IActionResult> InventoryValuation([FromQuery] int? franchiseId = null) =>
        Run(async id => await service.InventoryValuationAsync(id, franchiseId ?? 0), "Inventory valuation generated.");

    private async Task<IActionResult> Run<T>(Func<int, Task<T>> action, string message)
    {
        var ownerVal = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("nameid") ?? User.FindFirstValue("sub") ?? User.FindFirstValue("owner_id");
        if (!int.TryParse(ownerVal, out var ownerId))
            return Unauthorized(new ApiResponse<object?> { StatusCode = 401, Message = "A valid owner token is required." });
        try
        {
            return Ok(new ApiResponse<T> { StatusCode = 200, Message = message, Data = await action(ownerId) });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse<object?> { StatusCode = 400, Message = ex.Message });
        }
    }
}
