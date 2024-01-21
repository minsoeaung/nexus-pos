namespace Backend.Entities;

public class ReceiptItem
{
    public int Id { get; set; }
    public int ReceiptId { get; set; }
    public double Price { get; set; }
    public int Quantity { get; set; }
    public int? ItemId { get; set; }
    public Item? Item { get; set; }
}