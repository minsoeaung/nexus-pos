using Backend.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class StoreContext(DbContextOptions options) : IdentityDbContext<AppUser, AppRole, int>(options)
{
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<AppUser>().ToTable("Users");
        builder.Entity<AppRole>().ToTable("Roles");
        builder.Entity<IdentityUserRole<int>>().ToTable("UserRoles");

        builder.Entity<Item>()
            .HasMany(i => i.ReceiptItems)
            .WithOne(r => r.Item)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Entity<AppUser>()
            .HasMany(i => i.Receipts)
            .WithOne(r => r.AppUser)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Entity<Category>()
            .HasIndex(u => u.Name)
            .IsUnique();

        builder.Entity<Vendor>()
            .HasIndex(u => u.Name)
            .IsUnique();
    }

    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Item> Items => Set<Item>();
    public DbSet<Receipt> Receipts => Set<Receipt>();
    public DbSet<ReceiptItem> ReceiptItems => Set<ReceiptItem>();
    public DbSet<Vendor> Vendors => Set<Vendor>();
};