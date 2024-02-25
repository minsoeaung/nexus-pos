using Backend.Entities;

namespace Backend.Extensions;

public static class ItemExtensions
{
    public static IQueryable<Item> StockLessThanOrEquals(this IQueryable<Item> query, int? stockThreshold)
    {
        if (stockThreshold is >= 0)
            return query.Where(item => item.Stock <= stockThreshold);

        return query;
    }

    public static IQueryable<Item> Sort(this IQueryable<Item> query, string? orderBy)
    {
        query = orderBy switch
        {
            "price" => query.OrderBy(p => p.Price),
            "priceDesc" => query.OrderByDescending(p => p.Price),
            "stock" => query.OrderBy(p => p.Stock),
            "stockDesc" => query.OrderByDescending(p => p.Stock),
            "stockThreshold" => query.Where(p => p.Stock <= 20),
            _ => query.OrderByDescending(p => p.Id)
        };

        return query;
    }

    public static IQueryable<Item> Search(this IQueryable<Item> query, string? searchTerm)
    {
        return string.IsNullOrWhiteSpace(searchTerm)
            ? query
            : query.Where(p => p.Name.ToLower().Contains(searchTerm.Trim().ToLower()));
    }

    public static IQueryable<Item> Filter(this IQueryable<Item> query, string? brands, string? categories)
    {
        var vendorList = new List<string>();
        var categoryList = new List<string>();

        if (!string.IsNullOrWhiteSpace(brands))
            vendorList.AddRange(brands.Trim().ToLower().Split(",").ToList());

        if (!string.IsNullOrWhiteSpace(categories))
            categoryList.AddRange(categories.Trim().ToLower().Split(",").ToList());

        query = query.Where(p => vendorList.Count == 0 || vendorList.Contains(p.Vendor.Name.ToLower()));
        query = query.Where(p => categoryList.Count == 0 || categoryList.Contains(p.Category.Name.ToLower()));

        return query;
    }
}