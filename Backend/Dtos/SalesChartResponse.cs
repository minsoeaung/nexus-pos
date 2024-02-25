namespace Backend.Dtos;

public class SalesChartResponse
{
    public IEnumerable<MonthAmount> MonthlySales { get; set; } = [];
    public IEnumerable<TopSellingItem> TopSellingItems { get; set; }
    public int ForYear { get; set; }
}

public class TopSellingItem
{
    public int ItemId { get; set; }
    public string Name { get; set; }
    public double AmountSold { get; set; }
}

public class MonthAmount
{
    public string Month { get; set; }
    public double Amount { get; set; }
}