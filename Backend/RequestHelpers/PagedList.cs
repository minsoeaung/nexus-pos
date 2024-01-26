using Microsoft.EntityFrameworkCore;

namespace Backend.RequestHelpers;

public class PagedList<T> : List<T>
{
    public MetaData MetaData { get; }

    private PagedList(List<T> items, int totalCount, int currentPage, int pageSize)
    {
        MetaData = new MetaData
        {
            CurrentPage = currentPage,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        };
        AddRange(items);
    }

    public static async Task<PagedList<T>> ToPagedList(IQueryable<T> query, int currentPage, int pageSize)
    {
        var count = await query.CountAsync();
        var items = await query.Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
        return new PagedList<T>(items, count, currentPage, pageSize);
    }
}