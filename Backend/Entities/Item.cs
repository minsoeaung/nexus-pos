namespace Backend.Entities;

public class Item
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int VendorId { get; set; }
    public Vendor Vendor { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; }
    public int Stock { get; set; }
    public double Price { get; set; }
    public int UserId { get; set; } // Admin
    public User User { get; set; } // Admin
}