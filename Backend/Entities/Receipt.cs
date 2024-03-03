namespace Backend.Entities;

public class Receipt
{
    public int Id { get; set; }
    public int? CustomerId { get; set; }
    public Customer? Customer { get; set; }

    public int? AppUserId { get; set; }
    public AppUser? AppUser { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<ReceiptItem> ReceiptItems { get; set; } = new List<ReceiptItem>();
}