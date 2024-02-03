using Microsoft.AspNetCore.Identity;

namespace Backend.Entities;

public class AppUser : IdentityUser<int>
{
    public ICollection<Item> Items { get; set; } = new List<Item>();
    public bool Suspend { get; set; } = false;
}