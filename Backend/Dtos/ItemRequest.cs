using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos;

public class ItemRequest
{
    [Required] [MinLength(1)] public string Name { get; set; }
    [Required] public int VendorId { get; set; }
    [Required] public int CategoryId { get; set; }
    [Required] [Range(0, int.MaxValue)] public int Stock { get; set; }

    [Required] [Range(1, double.MaxValue)] public double Price { get; set; }
}