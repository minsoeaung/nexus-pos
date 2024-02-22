using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController(StoreContext storeContext) : ControllerBase
{
    [HttpGet("categories-pie-chart")]
    public async Task<IActionResult> GetCategoriesPieChart()
    {
        var totalStock = storeContext.Items.Sum(i => i.Stock);

        var categoryPercentages = await storeContext.Items
            .GroupBy(i => i.CategoryId)
            .Select(grouping => new
            {
                CategoryName = storeContext.Categories.FirstOrDefault(c => c.Id == grouping.Key)!.Name,
                Percentage = (double)grouping.Sum(i => i.Stock) / totalStock * 100
            })
            .ToListAsync();

        double total = 0;

        foreach (var categoryPercentage in categoryPercentages)
        {
            total += categoryPercentage.Percentage;
            Console.WriteLine(
                $"Category: {categoryPercentage.CategoryName}, Percentage: {categoryPercentage.Percentage}%");
        }

        Console.WriteLine($"Total: {total}");

        return NoContent();
    }

    [HttpGet("vendors-pie-chart")]
    public async Task<IActionResult> GetVendorsPieChart()
    {
        var totalStock = storeContext.Items.Sum(i => i.Stock);

        var vendorPercentages = await storeContext.Items
            .GroupBy(i => i.VendorId)
            .Select(grouping => new
            {
                VendorName = storeContext.Vendors.FirstOrDefault(c => c.Id == grouping.Key)!.Name,
                Percentage = (double)grouping.Sum(i => i.Stock) / totalStock * 100
            })
            .ToListAsync();

        double total = 0;

        foreach (var vendorPercentage in vendorPercentages)
        {
            total += vendorPercentage.Percentage;
            Console.WriteLine(
                $"Vendor: {vendorPercentage.VendorName}, Percentage: {vendorPercentage.Percentage}%");
        }

        Console.WriteLine($"Total: {total}");

        return NoContent();
    }
}