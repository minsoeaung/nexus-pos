using Backend.Dtos;
using Backend.Entities;
using Mapster;

namespace Backend.Mappings;

public class AppUserMapping : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<(AppUser appUser, IList<string> Roles), AppUserResponse>()
            .Map(dest => dest, src => src.appUser)
            // .Map(dest => dest.Suspend, src => src.appUser.Suspend)
            .Map(dest => dest.Roles, src => src.Roles);

        config.ForType<List<AppUser>, IEnumerable<AppUserResponse>>();
        // .Map(dest => dest, src => src.AsEnumerable().Adapt<IEnumerable<AppUserResponse>>());
    }
}