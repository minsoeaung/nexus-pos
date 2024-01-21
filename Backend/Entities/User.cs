using Microsoft.AspNetCore.Identity;

namespace Backend.Entities;

public class User : IdentityUser<int>
{
    public ICollection<Item> Items { get; set; } = new List<Item>();
}