using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos;

public class ReceiptRequest
{
    public int CustomerId { get; set; } // If 0, the customer is new.
    public string Name { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;

    [Required, MinLength(1)] public IEnumerable<OrderItem> OrderItems { get; set; }
}

public class OrderItem
{
    public int ItemId { get; set; }
    public int Quantity { get; set; }
}