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
    public int AppUserId { get; set; } // Admin
    public AppUser AppUser { get; set; } // Admin
    public DateTime CreatedAt { get; set; }

    public ICollection<ReceiptItem> ReceiptItems { get; set; } = [];
}