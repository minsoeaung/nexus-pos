using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos;

public class AdminRequest
{
    [Required] [MinLength(1)] public string UserName { get; set; } = string.Empty;
    [Required] [MinLength(6)] public string Password { get; set; } = string.Empty;
    [Required] [EmailAddress] public string Email { get; set; } = string.Empty;
}