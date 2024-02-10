using Backend.Entities;
using Bogus;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public static class Seeders
{
    private static List<Vendor> Vendors { get; set; } = [];
    private static List<Category> Categories { get; set; } = [];
    private static List<Item> Items { get; set; } = [];

    public static async Task Seed(StoreContext context,
        UserManager<AppUser> userManager,
        RoleManager<AppRole> roleManager)
    {
        if (!context.Roles.Any())
        {
            await roleManager.CreateAsync(new AppRole
            {
                Id = 1, Name = "SuperAdmin", NormalizedName = "SUPERADMIN", ConcurrencyStamp = Guid.NewGuid().ToString()
            });
            await roleManager.CreateAsync(new AppRole
                { Id = 2, Name = "Admin", NormalizedName = "ADMIN", ConcurrencyStamp = Guid.NewGuid().ToString() });

            await context.Database.ExecuteSqlRawAsync("alter sequence \"AspNetRoles_Id_seq\" restart with 3");
        }

        if (!context.Users.Any())
        {
            var superUser = new AppUser
            {
                Id = 1,
                UserName = "superadmin",
                Email = "superadmin@gmail.com",
                EmailConfirmed = true,
                NormalizedEmail = "SUPERADMIN@GMAIL.COM",
                NormalizedUserName = "SUPERADMIN",
                SecurityStamp = Guid.NewGuid().ToString()
            };
            await userManager.CreateAsync(superUser, "password");
            await userManager.AddToRolesAsync(superUser, new List<string> { "SuperAdmin", "Admin" });

            var adminUser = new AppUser
            {
                Id = 2,
                UserName = "admin",
                Email = "admin@gmail.com",
                EmailConfirmed = true,
                NormalizedEmail = "ADMIN@GMAIL.COM",
                NormalizedUserName = "ADMIN",
                SecurityStamp = Guid.NewGuid().ToString()
            };

            await userManager.CreateAsync(adminUser, "password");
            await userManager.AddToRoleAsync(adminUser, "Admin");

            await context.Database.ExecuteSqlRawAsync("alter sequence \"AspNetUsers_Id_seq\" restart with 3");
        }

        if (!context.Items.Any())
        {
            const int itemNumToSeed = 10;
            const int vendorNumToSeed = 5;
            const int categoryNumToSeed = 5;

            var vendorIds = 1;
            var vendorFaker = new Faker<Vendor>()
                .StrictMode(true)
                .UseSeed(1111)
                .RuleFor(d => d.Id, f => vendorIds++)
                .RuleFor(d => d.Name, f => (f.Commerce.Product() + vendorIds).Replace(",", ""));
            Vendors = vendorFaker.Generate(vendorNumToSeed);

            var categoryIds = 1;
            var categoryFaker = new Faker<Category>()
                .StrictMode(true)
                .UseSeed(5555)
                .RuleFor(d => d.Id, f => categoryIds++)
                .RuleFor(d => d.Name, f => (f.Commerce.Product() + categoryIds).Replace(",", ""));
            Categories = categoryFaker.Generate(categoryNumToSeed);

            var itemIds = 1;
            var itemFaker = new Faker<Item>()
                .StrictMode(false)
                .UseSeed(7777)
                .RuleFor(d => d.Id, f => itemIds++)
                .RuleFor(p => p.Name, f => f.Commerce.ProductName())
                .RuleFor(p => p.Price, f => f.Random.Number(20, 200))
                .RuleFor(p => p.Stock, f => f.Random.Number(20, 200))
                .RuleFor(p => p.VendorId, f => f.PickRandom(Vendors).Id)
                .RuleFor(p => p.CategoryId, f => f.PickRandom(Categories).Id)
                .RuleFor(p => p.CreatedAt, f => DateTime.UtcNow)
                .RuleFor(p => p.AppUserId, 2);
            Items = itemFaker.Generate(itemNumToSeed);

            await context.Vendors.AddRangeAsync(Vendors);
            await context.Categories.AddRangeAsync(Categories);
            await context.Items.AddRangeAsync(Items);

            await context.Database.ExecuteSqlRawAsync("alter sequence \"Items_Id_seq\" restart with 11");
            await context.Database.ExecuteSqlRawAsync("alter sequence \"Categories_Id_seq\" restart with 6");
            await context.Database.ExecuteSqlRawAsync("alter sequence \"Vendors_Id_seq\" restart with 6");
        }

        await context.SaveChangesAsync();
    }
}