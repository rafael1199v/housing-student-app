using HousingApp.Api.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace HousingApp.Api.Extensions;

public static class SignalRExtensions
{
    public static IServiceCollection AddRealtimeMessaging(this IServiceCollection services)
    {
        services.AddSignalR();

        services.AddSingleton<IUserIdProvider, SubClaimUserIdProvider>();

        return services;
    }
}
