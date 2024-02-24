using Backend.Data;
using Backend.Dtos;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController(StoreContext storeContext, IMapper mapper) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CustomerResponse>>> GetCustomers()
    {
        var customers = await storeContext.Customers.ToListAsync();
        return Ok(mapper.Map<IEnumerable<CustomerResponse>>(customers));
    }
}