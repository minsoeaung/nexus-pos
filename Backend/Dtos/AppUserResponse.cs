namespace Backend.Dtos;

public class AppUserResponse
{
    public int Id { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public bool EmailConfirmed { get; set; }
    public bool Suspend { get; set; }
    public IList<string> Roles { get; set; } = [];
}