using Backend.Data;
using Backend.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController(StoreContext storeContext) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetAllCategories()
    {
        return await storeContext.Categories.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Category>> GetCategory(int id)
    {
        var category = await storeContext.Categories.FindAsync(id);
        return category == null ? NotFound() : category;
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Category>> PutCategory(int id, string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return BadRequest();

        var category = await storeContext.Categories.FindAsync(id);
        if (category == null)
            return NotFound();

        category.Name = name.Trim();

        try
        {
            await storeContext.SaveChangesAsync();
        }
        catch
        {
            ModelState.AddModelError("Duplicate", $"{category.Name} already exists.");
            return ValidationProblem();
        }

        return category;
    }

    [HttpPost]
    public async Task<ActionResult<Category>> PostCategory(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return BadRequest();

        var category = new Category
        {
            Name = name.Trim()
        };

        storeContext.Categories.Add(category);

        try
        {
            await storeContext.SaveChangesAsync();
        }
        catch
        {
            ModelState.AddModelError("Duplicate", $"{category.Name} already exists.");
            return ValidationProblem();
        }

        return CreatedAtAction(
            nameof(GetCategory),
            new { id = category.Id },
            category);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await storeContext.Categories.FindAsync(id);
        if (category == null)
            return NotFound();

        storeContext.Categories.Remove(category);
        await storeContext.SaveChangesAsync();

        return NoContent();
    }
}