using HousingApp.Api.Policies;
using System.Threading.RateLimiting;

namespace HousingApp.Api.Extensions
{
    public static class RateLimiterExtension
    {
        public static IServiceCollection AddRateLimiterPolicy(this IServiceCollection services)
        {

            services.AddRateLimiter(options =>
            {
                options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

                options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
                    RateLimitPartition.GetFixedWindowLimiter(
                        partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                        factory: _ => new FixedWindowRateLimiterOptions
                        {
                            PermitLimit = 40,
                            Window = TimeSpan.FromSeconds(60),
                        }));
            });

            return services;
        }
    }
}