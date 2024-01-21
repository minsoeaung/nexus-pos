namespace Backend.Entities;

public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string PhoneNumber { get; set; }
    public string Address { get; set; }
    public ICollection<Receipt> Receipts { get; set; } = new List<Receipt>();
}