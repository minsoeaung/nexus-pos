using System.Globalization;
using Backend.Data;
using Backend.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController(StoreContext storeContext) : ControllerBase
{
    [HttpGet("statistics")]
    public async Task<ActionResult<StatisticsResponse>> GetStats()
    {
        return new StatisticsResponse
        {
            TodaySales = await storeContext
                .Receipts
                .Where(receipt => receipt.CreatedAt.Day == DateTime.Now.Day)
                .SumAsync(r => r.ReceiptItems.Sum(ri => ri.Quantity * ri.Price)),
            AnnualSales = await storeContext
                .Receipts
                .Where(receipt => receipt.CreatedAt.Year == DateTime.Now.Year)
                .SumAsync(r => r.ReceiptItems.Sum(ri => ri.Quantity * ri.Price)),
            TotalUniqueProducts = await storeContext.Items.CountAsync(),
            NumberOfProductsSold = await storeContext.ReceiptItems.SumAsync(r => r.Quantity)
        };
    }


    [HttpGet("sales-proportion")]
    public async Task<ActionResult<IEnumerable<ProportionResponse>>> GetCategoriesPieChart(
        [FromQuery] string type = "category")
    {
        return await storeContext
            .ReceiptItems
            // TODO: check this null
            .GroupBy(item => type == "category" ? item.Item.Category.Name : item.Item.Vendor.Name)
            .Select(group => new ProportionResponse
            {
                Type = group.Key,
                Value = Math.Round(
                    (double)group.Sum(i => i.Quantity) / storeContext.ReceiptItems.Sum(i => i.Quantity) * 100
                    , 2
                )
            })
            .ToListAsync();
    }

    [HttpGet("monthly-sales")]
    public ActionResult<SalesChartResponse> GetMonthlySales([FromQuery] int? year)
    {
        return new SalesChartResponse
        {
            MonthlySales = (
                from a in (
                    // List 1: 12 Months filled with amount 0
                    from monthName in CultureInfo.CurrentCulture.DateTimeFormat.AbbreviatedMonthNames
                    where !string.IsNullOrWhiteSpace(monthName)
                    select new MonthAmount { Month = monthName, Amount = 0 }
                ).ToList()
                join b in (
                        // List 2: Data available months filled with real sold amount
                        from r in storeContext.Receipts
                        where r.CreatedAt.Year == (year ?? DateTime.Now.Year)
                        group r by new { r.CreatedAt.Month }
                        into g
                        select new MonthAmount
                        {
                            Month = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(g.Key.Month),
                            Amount = g.SelectMany(r => r.ReceiptItems).Sum(item => item.Price * item.Quantity)
                        }
                    ).ToList()
                    on a.Month equals b.Month into temp
                // Left outer join List 1 and 2
                from c in temp.DefaultIfEmpty()
                select new MonthAmount
                {
                    Month = a.Month,
                    Amount = c?.Amount ?? 0
                }
            ).ToList(),
            TopSellingItems = (
                    from receiptItem in storeContext.ReceiptItems
                    join receipt in storeContext.Receipts on receiptItem.ReceiptId equals receipt.Id
                    join item in storeContext.Items on receiptItem.ItemId equals item.Id
                    where receipt.CreatedAt.Year == (year ?? DateTime.Now.Year)
                    group receiptItem by new
                    {
                        ItemId = item.Id, ItemName = item.Name
                    }
                    into grouping
                    select new TopSellingItem
                    {
                        ItemId = grouping.Key.ItemId,
                        Name = grouping.Key.ItemName,
                        AmountSold = grouping.Sum(r => r.Quantity * r.Price),
                    })
                .OrderByDescending(topSellingItem => topSellingItem.AmountSold)
                .Take(10),
            ForYear = year ?? DateTime.Now.Year
        };
    }
}