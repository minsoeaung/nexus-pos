using Backend.Dtos;
using Backend.Entities;
using Backend.RequestHelpers;
using Mapster;

namespace Backend.Mappings;

public class ItemMapping : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<ItemRequest, Item>();

        config.NewConfig<Item, ItemResponse>()
            .Map(dest => dest.CreatedBy, src => src.AppUser);

        config.ForType<PagedList<Item>, IEnumerable<ItemResponse>>()
            .Map(dest => dest, src => src.AsEnumerable().Adapt<IEnumerable<ItemResponse>>());
    }
}