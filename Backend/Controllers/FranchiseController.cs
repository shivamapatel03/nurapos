using Microsoft.AspNetCore.Mvc;
using Nurapos.DTOs.Franchise;
using Nurapos.Services.Interfaces;
using Npgsql;

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
    public async Task<IActionResult> Create(
        [FromForm] CreateFranchiseRequest request)
    {
        try
        {
            var result = await _service.CreateAsync(request);

            return CreatedAtAction(
                nameof(GetById),
                new { id = result.FranchiseId },
                new
                {
                    message = "Franchise created successfully.",
                    data = result
                }
            );
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
    }


    // =========================================================
    // GET ALL FRANCHISES
    // GET: api/franchises
    // =========================================================
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();

        return Ok(new
        {
            message = "Franchises fetched successfully.",
            data = result
        });
    }


    // =========================================================
    // GET FRANCHISE BY ID
    // GET: api/franchises/{id}
    // =========================================================
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var result = await _service.GetByIdAsync(id);

            if (result == null)
            {
                return NotFound(new
                {
                    message = "Franchise not found."
                });
            }

            return Ok(new
            {
                message = "Franchise fetched successfully.",
                data = result
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }


    // =========================================================
    // UPDATE FRANCHISE
    // PUT: api/franchises/{id}
    // =========================================================
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateFranchiseRequest request)
    {
        try
        {
            var result =
                await _service.UpdateAsync(id, request);

            return Ok(new
            {
                message = "Franchise updated successfully.",
                data = result
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }


    // =========================================================
    // DELETE FRANCHISE
    // DELETE: api/franchises/{id}
    // =========================================================
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _service.DeleteAsync(id);

            return Ok(new
            {
                message = "Franchise deleted successfully."
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
        catch (PostgresException ex)
            when (ex.SqlState == "23503")
        {
            return Conflict(new
            {
                message =
                    "This franchise cannot be deleted because it is already being used by other records."
            });
        }
    }
}
