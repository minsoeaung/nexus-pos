using Backend.Data;
using Backend.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Extensions;

public static class DbInitializer
{
    public static async void CreateDbIfNotExistsAndSeed(this IHost host)
    {
        var scope = host.Services.CreateScope();
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<StoreContext>();
        var userManager = services.GetRequiredService<UserManager<AppUser>>();
        var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
        await context.Database.MigrateAsync();
        await context.Database.EnsureCreatedAsync();
        await Seeders.Seed(context, userManager, roleManager);
    }
}