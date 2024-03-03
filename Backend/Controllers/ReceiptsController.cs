using System.Security.Claims;
using Backend.Data;
using Backend.Dtos;
using Backend.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

// [Authorize]
[ApiController]
[Route("api/[controller]")]
public class ReceiptsController(StoreContext storeContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Receipt>>> GetAllReceipts()
    {
        return await storeContext
            .Receipts
            .Include(r => r.AppUser)
            .Include(r => r.Customer)
            .Include(r => r.ReceiptItems)
            .ThenInclude(ri => ri.Item)
            .ThenInclude(i => i.Vendor)
            .Include(r => r.ReceiptItems)
            .ThenInclude(ri => ri.Item)
            .ThenInclude(i => i.Category)
            .OrderByDescending(r => r.CreatedAt)
            .AsNoTracking()
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Receipt>> GetReceipt(int id)
    {
        var receipt = await storeContext
            .Receipts
            .Include(r => r.AppUser)
            .Include(r => r.Customer)
            .Include(r => r.ReceiptItems)
            .ThenInclude(ri => ri.Item)
            .ThenInclude(i => i.Vendor)
            .Include(r => r.ReceiptItems)
            .ThenInclude(ri => ri.Item)
            .ThenInclude(i => i.Category)
            .OrderByDescending(r => r.CreatedAt)
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == id);

        return receipt == null ? NotFound() : receipt;
    }

    [HttpPost]
    public async Task<IActionResult> CreateReceipt(ReceiptRequest dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        int.TryParse(userId, out var validUserId);

        if (validUserId == 0)
            return Unauthorized();

        await using var transaction = await storeContext.Database.BeginTransactionAsync();

        try
        {
            Customer customer;
            if (dto.CustomerId == 0)
            {
                customer = new Customer()
                {
                    Name = dto.Name,
                    PhoneNumber = dto.PhoneNumber,
                    Address = dto.Address
                };
                await storeContext.Customers.AddAsync(customer);
            }
            else
            {
                var c = await storeContext.Customers.FindAsync(dto.CustomerId);
                if (c == null)
                {
                    ModelState.AddModelError("CustomerNotFound", "Customer id does not exist.");
                    return ValidationProblem();
                }

                customer = c;
            }

            var itemIds = dto.OrderItems.Select(orderItem => orderItem.ItemId).ToArray();

            var items = await storeContext.Items
                .Where(item => itemIds.Contains(item.Id))
                .ToListAsync();

            var receiptItems = new List<ReceiptItem>();
            bool notEnough = false;

            foreach (var orderItem in dto.OrderItems)
            {
                var item = items.FirstOrDefault(i => i.Id == orderItem.ItemId);
                if (item != null && orderItem.Quantity > 0)
                {
                    if (orderItem.Quantity > item.Stock)
                    {
                        ModelState.AddModelError("NotEnoughStock", $"Not enough stock for {item.Name}.");
                        notEnough = true;
                    }
                    else
                    {
                        item.Stock -= orderItem.Quantity;
                    }

                    var receiptItem = new ReceiptItem
                    {
                        ItemId = item.Id,
                        Quantity = orderItem.Quantity,
                        Price = item.Price
                    };
                    receiptItems.Add(receiptItem);
                }
            }

            if (notEnough)
            {
                await transaction.RollbackAsync();
                return ValidationProblem();
            }

            // May be I need Customer here, not just id, bc I didn't save changes yet.
            var receipt = new Receipt
            {
                Customer = customer,
                CreatedAt = DateTime.UtcNow,
                ReceiptItems = receiptItems,
                AppUserId = validUserId
            };

            await storeContext.Receipts.AddAsync(receipt);
            await storeContext.SaveChangesAsync();

            await transaction.CommitAsync();

            return NoContent();
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}