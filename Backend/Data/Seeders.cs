using Backend.Entities;
using Bogus;
using Microsoft.AspNetCore.Identity;

namespace Backend.Data;

public static class Seeders
{
    private static List<Vendor> Vendors { get; set; }
    private static List<Category> Categories { get; set; }
    private static List<Item> Items { get; set; }

    public static async Task Seed(StoreContext context, UserManager<User> userManager)
    {
        if (!context.Roles.Any())
        {
            var super = new Role { Id = 1, Name = "SuperAdmin", NormalizedName = "SUPERADMIN" };
            var admin = new Role { Id = 2, Name = "Admin", NormalizedName = "ADMIN" };
            var roles = new List<Role> { super, admin };
            await context.Roles.AddRangeAsync(roles);
        }

        if (!context.Users.Any())
        {
            var superUser = new User
            {
                Id = 1,
                UserName = "superadmin",
                Email = "superadmin@gmail.com",
                EmailConfirmed = true,
                NormalizedEmail = "SUPERADMIN@GMAIL.COM",
                NormalizedUserName = "SUPERADMIN",
            };
            await userManager.CreateAsync(superUser, "superadmin");
            await userManager.AddToRolesAsync(superUser, new List<string> { "SuperAdmin", "Admin" });

            var adminUser = new User
            {
                Id = 2,
                UserName = "admin",
                Email = "admin@gmail.com",
                EmailConfirmed = true,
                NormalizedEmail = "ADMIN@GMAIL.COM",
                NormalizedUserName = "ADMIN",
            };

            await userManager.CreateAsync(adminUser, "admin");
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }

        if (!context.Items.Any())
        {
            const int itemNumToSeed = 50;
            const int vendorNumToSeed = 20;
            const int categoryNumToSeed = 20;

            var vendorIds = 1;
            var vendorFaker = new Faker<Vendor>()
                .StrictMode(true)
                .UseSeed(1111)
                .RuleFor(d => d.Id, f => vendorIds++)
                .RuleFor(d => d.Name, f => (f.Company.CompanyName() + vendorIds).Replace(",", ""));
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
                .RuleFor(p => p.UserId, 2);
            Items = itemFaker.Generate(itemNumToSeed);

            await context.Vendors.AddRangeAsync(Vendors);
            await context.Categories.AddRangeAsync(Categories);
            await context.Items.AddRangeAsync(Items);
        }

        await context.SaveChangesAsync();
    }
}