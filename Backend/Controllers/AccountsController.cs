using System.Security.Claims;
using Backend.Data;
using Backend.Dtos;
using Backend.Entities;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AccountsController(
    UserManager<AppUser> userManager,
    IMapper mapper,
    RoleManager<AppRole> roleManager,
    StoreContext storeContext)
    : ControllerBase
{
    [HttpGet("me")]
    public async Task<ActionResult<AppUserResponse>> GetMe()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        int.TryParse(userId, out var validUserId);

        if (validUserId == 0)
            return Unauthorized();

        var user = await userManager.FindByIdAsync(validUserId.ToString());

        if (user == null)
            return Unauthorized();

        var roles = await userManager.GetRolesAsync(user);

        return mapper.Map<AppUserResponse>((user, roles));
    }

    [Authorize(Roles = "SuperAdmin")]
    [HttpGet("admins")]
    public async Task<IEnumerable<AppUserResponse>> GetAllAdmins()
    {
        var usersQuery =
            from user in storeContext.Users
            select new
            {
                user.Id,
                user.UserName,
                user.Email,
                user.EmailConfirmed,
                user.Suspend,
                Roles = (
                        from userRole in storeContext.UserRoles
                        join role in storeContext.Roles
                            on userRole.RoleId equals role.Id
                        where userRole.UserId == user.Id
                        select role.Name)
                    .ToList()
            };

        return await usersQuery.Select(u => new AppUserResponse
        {
            Id = u.Id,
            UserName = u.UserName,
            Email = u.Email,
            EmailConfirmed = u.EmailConfirmed,
            Roles = u.Roles,
            Suspend = u.Suspend
        }).ToListAsync();
    }

    [Authorize(Roles = "SuperAdmin")]
    [HttpPost("admins/toggle-suspend")]
    public async Task<IActionResult> SuspendAdmin([FromQuery] string id)
    {
        var user = await userManager.FindByIdAsync(id);
        if (user == null)
            return NotFound();

        user.Suspend = !user.Suspend;

        var result = await userManager.UpdateAsync(user);

        if (result.Succeeded)
            return NoContent();

        foreach (var identityError in result.Errors)
            ModelState.AddModelError(identityError.Code, identityError.Description);

        return ValidationProblem();
    }

    [Authorize(Roles = "SuperAdmin")]
    [HttpPost("admins")]
    public async Task<IActionResult> CreateAdminAccount(AdminRequest dto)
    {
        var appUser = new AppUser
        {
            UserName = dto.UserName,
            Email = dto.Email,
        };

        var result = await userManager.CreateAsync(appUser, dto.Password);

        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(appUser, "Admin");
            return NoContent();
        }

        foreach (var identityError in result.Errors)
            ModelState.AddModelError(identityError.Code, identityError.Description);

        return ValidationProblem();
    }
}