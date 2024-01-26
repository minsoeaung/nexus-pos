using Backend.RequestHelpers;

namespace Backend.Dtos;

public class PagedResponse<T>
{
    public MetaData Pagination { get; set; }
    public IEnumerable<T> Results { get; set; }
}