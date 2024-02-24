using Backend.Dtos;
using Backend.Entities;
using Mapster;

namespace Backend.Mappings;

public class CustomerMapping : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.ForType<List<Customer>, IEnumerable<CustomerResponse>>()
            .Map(dest => dest, src => src.AsEnumerable().Adapt<IEnumerable<CustomerResponse>>());
    }
}