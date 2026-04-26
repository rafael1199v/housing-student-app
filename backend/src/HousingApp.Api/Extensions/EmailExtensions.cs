using Resend;

namespace HousingApp.Api.Extensions;

public static class EmailExtensions
{
    public static IServiceCollection AddEmailConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<ResendClientOptions>(options =>
        {
            options.ApiToken = configuration["Resend:ApiKey"] ??
                               throw new System.Exception("Resend:ApiKey not found in configuration");
        });

        services.AddTransient<IResend, ResendClient>();

        return services;
    }
}
