using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using Nurapos.DTOs;
using Nurapos.DTOs.Catalog;
using Nurapos.Models;
using Nurapos.Services.Interfaces;
using Nurapos.Filters;

namespace Nurapos.Controllers;

[ApiController]
[Authorize(Roles = "FRANCHISE_OWNER", Policy = "PosPinVerified")]
[Route("api/owner-catalog")]
public sealed class OwnerCatalogController : ControllerBase
{
    private readonly IOwnerCatalogService _service;

    public OwnerCatalogController(IOwnerCatalogService service) => _service = service;

    [HttpGet("categories")]
    public Task<IActionResult> GetCategories() => List(OwnerCatalogType.Category, "Categories fetched successfully.");
    [HttpGet("expense-categories")]
    public Task<IActionResult> GetExpenseCategories() => List(OwnerCatalogType.ExpenseCategory, "Expense categories fetched successfully.");
    [HttpGet("suppliers")]
    public Task<IActionResult> GetSuppliers() => List(OwnerCatalogType.Supplier, "Suppliers fetched successfully.");
    [HttpGet("products")]
    public Task<IActionResult> GetProducts() => List(OwnerCatalogType.Product, "Products fetched successfully.");

    [HttpGet("categories/{id:int}")]
    public Task<IActionResult> GetCategory([Range(1, int.MaxValue)] int id) => Get(OwnerCatalogType.Category, id);
    [HttpGet("expense-categories/{id:int}")]
    public Task<IActionResult> GetExpenseCategory([Range(1, int.MaxValue)] int id) => Get(OwnerCatalogType.ExpenseCategory, id);
    [HttpGet("suppliers/{id:int}")]
    public Task<IActionResult> GetSupplier([Range(1, int.MaxValue)] int id) => Get(OwnerCatalogType.Supplier, id);
    [HttpGet("products/{id:int}")]
    public Task<IActionResult> GetProduct([Range(1, int.MaxValue)] int id) => Get(OwnerCatalogType.Product, id);

    [HttpPost("categories")]
    public Task<IActionResult> CreateCategory(CategoryRequest request) => Create(OwnerCatalogType.Category, new OwnerCatalogItem { Name = request.Name, Description = request.Description, Status = request.Status });
    [HttpPost("expense-categories")]
    public Task<IActionResult> CreateExpenseCategory(ExpenseCategoryRequest request) => Create(OwnerCatalogType.ExpenseCategory, new OwnerCatalogItem { Name = request.Name, Description = request.Description, Status = request.Status });
    [HttpPost("suppliers")]
    public Task<IActionResult> CreateSupplier(SupplierRequest request) => Create(OwnerCatalogType.Supplier, new OwnerCatalogItem { Name = request.Name, Contact = request.Contact, Email = request.Email, Address = request.Address, Status = request.Status });
    [HttpPost("products")]
    public Task<IActionResult> CreateProduct(ProductRequest request) => Create(OwnerCatalogType.Product, new OwnerCatalogItem { Name = request.Name, CategoryId = request.CategoryId, SellingPrice = request.SellingPrice, CostPrice = request.CostPrice, Unit = request.Unit, Status = request.Status });

    [HttpPut("categories/{id:int}")]
    public Task<IActionResult> UpdateCategory([Range(1, int.MaxValue)] int id, CategoryRequest request) => Update(OwnerCatalogType.Category, id, new OwnerCatalogItem { Name = request.Name, Description = request.Description, Status = request.Status });
    [HttpPut("expense-categories/{id:int}")]
    public Task<IActionResult> UpdateExpenseCategory([Range(1, int.MaxValue)] int id, ExpenseCategoryRequest request) => Update(OwnerCatalogType.ExpenseCategory, id, new OwnerCatalogItem { Name = request.Name, Description = request.Description, Status = request.Status });
    [HttpPut("suppliers/{id:int}")]
    public Task<IActionResult> UpdateSupplier([Range(1, int.MaxValue)] int id, SupplierRequest request) => Update(OwnerCatalogType.Supplier, id, new OwnerCatalogItem { Name = request.Name, Contact = request.Contact, Email = request.Email, Address = request.Address, Status = request.Status });
    [HttpPut("products/{id:int}")]
    public Task<IActionResult> UpdateProduct([Range(1, int.MaxValue)] int id, ProductRequest request) => Update(OwnerCatalogType.Product, id, new OwnerCatalogItem { Name = request.Name, CategoryId = request.CategoryId, SellingPrice = request.SellingPrice, CostPrice = request.CostPrice, Unit = request.Unit, Status = request.Status });

    [HttpDelete("categories/{id:int}")]
    public Task<IActionResult> DeleteCategory([Range(1, int.MaxValue)] int id) => Delete(OwnerCatalogType.Category, id);
    [HttpDelete("expense-categories/{id:int}")]
    public Task<IActionResult> DeleteExpenseCategory([Range(1, int.MaxValue)] int id) => Delete(OwnerCatalogType.ExpenseCategory, id);
    [HttpDelete("suppliers/{id:int}")]
    public Task<IActionResult> DeleteSupplier([Range(1, int.MaxValue)] int id) => Delete(OwnerCatalogType.Supplier, id);
    [HttpDelete("products/{id:int}")]
    public Task<IActionResult> DeleteProduct([Range(1, int.MaxValue)] int id) => Delete(OwnerCatalogType.Product, id);

    private async Task<IActionResult> List(OwnerCatalogType type, string message)
    {
        var ownerId = CurrentOwnerId();
        if (ownerId == null) return Unauthorized(Error(401, "A valid owner token is required."));
        return Ok(new ApiResponse<List<OwnerCatalogItem>>
        {
            StatusCode = 200,
            Message = message,
            Data = await _service.GetAllAsync(type, ownerId.Value)
        });
    }

    private async Task<IActionResult> Get(OwnerCatalogType type, int id)
    {
        var ownerId = CurrentOwnerId();
        if (ownerId == null) return Unauthorized(Error(401, "A valid owner token is required."));
        var item = await _service.GetByIdAsync(type, id, ownerId.Value);
        return item == null
            ? NotFound(Error(404, "Record not found."))
            : Ok(new ApiResponse<OwnerCatalogItem> { StatusCode = 200, Message = "Record fetched successfully.", Data = item });
    }

    private async Task<IActionResult> Create(OwnerCatalogType type, OwnerCatalogItem item)
    {
        var ownerId = CurrentOwnerId();
        if (ownerId == null) return Unauthorized(Error(401, "A valid owner token is required."));
        try
        {
            var created = await _service.CreateAsync(type, item, ownerId.Value);
            return StatusCode(201, new ApiResponse<OwnerCatalogItem> { StatusCode = 201, Message = "Record created successfully.", Data = created });
        }
        catch (KeyNotFoundException ex) { return NotFound(Error(404, ex.Message)); }
        catch (PostgresException ex) when (ex.SqlState is "23505" or "23503") { return Conflict(Error(409, "A related record conflicts with this request.")); }
    }

    private async Task<IActionResult> Update(OwnerCatalogType type, int id, OwnerCatalogItem item)
    {
        var ownerId = CurrentOwnerId();
        if (ownerId == null) return Unauthorized(Error(401, "A valid owner token is required."));
        try
        {
            var updated = await _service.UpdateAsync(type, id, item, ownerId.Value);
            return updated == null
                ? NotFound(Error(404, "Record not found."))
                : Ok(new ApiResponse<OwnerCatalogItem> { StatusCode = 200, Message = "Record updated successfully.", Data = updated });
        }
        catch (KeyNotFoundException ex) { return NotFound(Error(404, ex.Message)); }
        catch (PostgresException ex) when (ex.SqlState is "23505" or "23503") { return Conflict(Error(409, "A related record conflicts with this request.")); }
    }

    private async Task<IActionResult> Delete(OwnerCatalogType type, int id)
    {
        var ownerId = CurrentOwnerId();
        if (ownerId == null) return Unauthorized(Error(401, "A valid owner token is required."));
        try
        {
            return await _service.DeleteAsync(type, id, ownerId.Value)
                ? Ok(new ApiResponse<object?> { StatusCode = 200, Message = "Record deleted successfully." })
                : NotFound(Error(404, "Record not found."));
        }
        catch (PostgresException ex) when (ex.SqlState == "23503")
        {
            return Conflict(Error(409, "This record is used by another record and cannot be deleted."));
        }
    }

    private int? CurrentOwnerId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(value, out var id) ? id : null;
    }

    private static ApiResponse<object?> Error(int statusCode, string message) => new() { StatusCode = statusCode, Message = message };
}
