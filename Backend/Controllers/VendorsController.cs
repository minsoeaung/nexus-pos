using Backend.Data;
using Backend.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VendorsController(StoreContext storeContext) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Vendor>>> GetAllVendors()
    {
        return await storeContext.Vendors.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Vendor>> GetVendor(int id)
    {
        var vendor = await storeContext.Vendors.FindAsync(id);
        return vendor == null ? NotFound() : vendor;
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Vendor>> PutVendor(int id, string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return BadRequest();

        var vendor = await storeContext.Vendors.FindAsync(id);
        if (vendor == null)
            return NotFound();

        vendor.Name = name.Trim();

        try
        {
            await storeContext.SaveChangesAsync();
        }
        catch
        {
            ModelState.AddModelError("Duplicate", $"{vendor.Name} already exists.");
            return ValidationProblem();
        }

        return vendor;
    }

    [HttpPost]
    public async Task<ActionResult<Vendor>> PostVendor(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return BadRequest();

        var vendor = new Vendor
        {
            Name = name.Trim()
        };

        storeContext.Vendors.Add(vendor);

        try
        {
            await storeContext.SaveChangesAsync();
        }
        catch
        {
            ModelState.AddModelError("Duplicate", $"{vendor.Name} already exists.");
            return ValidationProblem();
        }

        return CreatedAtAction(
            nameof(GetVendor),
            new { id = vendor.Id },
            vendor);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVendor(int id)
    {
        var vendor = await storeContext.Vendors.FindAsync(id);
        if (vendor == null)
            return NotFound();

        storeContext.Vendors.Remove(vendor);
        await storeContext.SaveChangesAsync();

        return NoContent();
    }
}