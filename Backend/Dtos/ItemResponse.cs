using Backend.Entities;

namespace Backend.Dtos;

public class ItemResponse
{
    public int Id { get; set; }
    public string Name { get; set; }
    public Vendor Vendor { get; set; }
    public Category Category { get; set; }
    public int Stock { get; set; }
    public double Price { get; set; }
    public CreatedBy CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreatedBy
{
    public int Id { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public bool Suspend { get; set; }
}