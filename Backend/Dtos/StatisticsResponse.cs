namespace Backend.Dtos;

public class StatisticsResponse
{
    public double TodaySales { get; set; }
    public double AnnualSales { get; set; }
    public int TotalUniqueProducts { get; set; }
    public int NumberOfProductsSold { get; set; }
}