using HousingApp.Infrastructure.Persistence.Context;
using Microsoft.AspNetCore.Identity;

namespace HousingApp.Api.Extensions;

public static class IdentityExtensions
{
    public static IServiceCollection AddIdentityConfiguration(this IServiceCollection services)
    {
        services.AddIdentityCore<IdentityUser>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 6;
                options.User.RequireUniqueEmail = true;
            })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<HousingApplicationDbContext>();

        return services;
    }
}
