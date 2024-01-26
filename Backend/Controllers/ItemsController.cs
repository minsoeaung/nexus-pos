using System.Security.Claims;
using Backend.Data;
using Backend.Dtos;
using Backend.Entities;
using Backend.Extensions;
using Backend.RequestHelpers;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemsController(StoreContext storeContext, IMapper mapper) : ControllerBase
{
    [HttpGet]
    public async Task<PagedResponse<ItemResponse>> GetItems([FromQuery] ItemsParams itemsParams)
    {
        var query = storeContext.Items
            .Include(p => p.Vendor)
            .Include(p => p.Category)
            .Include(u => u.AppUser)
            .Sort(itemsParams.OrderBy)
            .Search(itemsParams.SearchTerm)
            .Filter(itemsParams.Vendors, itemsParams.Categories)
            .AsNoTracking()
            .AsQueryable();

        var pagedItems = await PagedList<Item>.ToPagedList(query, itemsParams.PageNumber, itemsParams.PageSize);

        return new PagedResponse<ItemResponse>
        {
            Pagination = pagedItems.MetaData,
            Results = mapper.Map<IEnumerable<ItemResponse>>(pagedItems)
        };
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ItemResponse>> GetItem(int id)
    {
        var item = await storeContext.Items
            .Include(i => i.Category)
            .Include(i => i.Vendor)
            .Include(i => i.AppUser)
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.Id == id);
        return item == null ? NotFound() : mapper.Map<ItemResponse>(item);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ItemResponse>> UpdateItem(int id, ItemRequest dto)
    {
        var item = await storeContext.Items.FindAsync(id);
        if (item == null)
            return NotFound();

        item.Name = dto.Name;
        item.VendorId = dto.VendorId; // Intentionally leave to check if this vendorId exists.
        item.CategoryId = dto.CategoryId; // Same as above
        item.Stock = dto.Stock;
        item.Price = dto.Price;

        storeContext.Items.Update(item);
        await storeContext.SaveChangesAsync();
        return mapper.Map<ItemResponse>(item);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateItem([FromForm] ItemRequest dto)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        int.TryParse(userIdStr, out var userId);

        if (userId <= 0)
            return Unauthorized();

        var item = mapper.Map<Item>(dto);
        item.AppUserId = userId;
        item.CreatedAt = DateTime.UtcNow;

        await storeContext.Items.AddAsync(item);
        var changes = await storeContext.SaveChangesAsync();
        return changes > 0 ? NoContent() : BadRequest();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteItem(int id)
    {
        var item = await storeContext.Items.FindAsync(id);
        if (item == null)
            return NotFound();

        storeContext.Items.Remove(item);
        await storeContext.SaveChangesAsync();
        return NoContent();
    }
}