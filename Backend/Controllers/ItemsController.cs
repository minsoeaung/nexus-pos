using System.Security.Claims;
using Backend.Data;
using Backend.Dtos;
using Backend.Entities;
using Backend.Extensions;
using Backend.RequestHelpers;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class ItemsController(StoreContext storeContext, IMapper mapper, UserManager<AppUser> userManager)
    : ControllerBase
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
            .StockLessThanOrEquals(itemsParams.StockThreshold)
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

    [HttpPut("{id}")]
    public async Task<ActionResult<ItemResponse>> UpdateItem(int id, ItemRequest dto)
    {
        var item = await storeContext.Items.FindAsync(id);
        if (item == null)
            return NotFound();

        var category = await storeContext.Categories.FindAsync(dto.CategoryId);
        if (category is null)
        {
            ModelState.AddModelError("categoryId", "The provided categoryId does not exist.");
            return ValidationProblem();
        }

        var vendor = await storeContext.Vendors.FindAsync(dto.VendorId);
        if (vendor is null)
        {
            ModelState.AddModelError("vendorId", "The provided vendorId does not exist.");
            return ValidationProblem();
        }

        item.Name = dto.Name;
        item.VendorId = dto.VendorId;
        item.Vendor = vendor;
        item.CategoryId = dto.CategoryId;
        item.Category = category;
        item.Stock = dto.Stock;
        item.Price = dto.Price;

        storeContext.Items.Update(item);
        await storeContext.SaveChangesAsync();

        item.AppUser = new AppUser
        {
            Id = item.AppUserId,
            Email = User.FindFirstValue(ClaimTypes.Email),
            UserName = User.FindFirstValue(ClaimTypes.Name)
        };

        return mapper.Map<ItemResponse>(item);
    }

    [HttpPost]
    public async Task<ActionResult<ItemResponse>> CreateItem(ItemRequest dto)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        int.TryParse(userIdStr, out var userId);

        if (userId <= 0)
            return Unauthorized();

        var category = await storeContext.Categories.FindAsync(dto.CategoryId);
        if (category is null)
        {
            ModelState.AddModelError("categoryId", "The provided categoryId does not exist.");
            return ValidationProblem();
        }

        var vendor = await storeContext.Vendors.FindAsync(dto.VendorId);
        if (vendor is null)
        {
            ModelState.AddModelError("vendorId", "The provided vendorId does not exist.");
            return ValidationProblem();
        }

        var item = mapper.Map<Item>(dto);
        item.AppUserId = userId;
        item.CreatedAt = DateTime.UtcNow;
        item.Category = category;
        item.Vendor = vendor;

        await storeContext.Items.AddAsync(item);
        await storeContext.SaveChangesAsync();

        item.AppUser = new AppUser
        {
            Id = userId,
            Email = User.FindFirstValue(ClaimTypes.Email),
            UserName = User.FindFirstValue(ClaimTypes.Name)
        };

        return CreatedAtAction(
            nameof(GetItem),
            new { id = item.Id },
            mapper.Map<ItemResponse>(item));
    }

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