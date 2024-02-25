namespace Backend.RequestHelpers;

public class ItemsParams
{
    public string? OrderBy { get; set; }
    public string? SearchTerm { get; set; }
    public string? Vendors { get; set; }
    public string? Categories { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public int? StockThreshold { get; set; }
}