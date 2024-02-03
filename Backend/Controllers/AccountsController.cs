using System.Security.Claims;
using Backend.Dtos;
using Backend.Entities;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AccountsController(UserManager<AppUser> userManager, IMapper mapper) : ControllerBase
{
    [HttpGet("me")]
    public async Task<ActionResult<Admin>> GetMe()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        int.TryParse(userId, out var validUserId);

        if (validUserId == 0)
            return Unauthorized();

        var user = await userManager.FindByIdAsync(validUserId.ToString());

        if (user == null)
            return Unauthorized();

        return mapper.Map<Admin>(user);
    }
}