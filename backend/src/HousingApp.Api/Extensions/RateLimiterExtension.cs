using System.Threading.RateLimiting;

namespace HousingApp.Api.Extensions;

public static class RateLimiterExtension
{
    public static IServiceCollection AddRateLimiterPolicy(this IServiceCollection services)
    {
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
                RateLimitPartition.GetFixedWindowLimiter(
                    httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    _ => new FixedWindowRateLimiterOptions { PermitLimit = 40, Window = TimeSpan.FromSeconds(60) }));
        });

        return services;
    }
}
