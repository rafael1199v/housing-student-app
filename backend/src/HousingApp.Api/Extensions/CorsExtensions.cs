namespace HousingApp.Api.Extensions
{
    public static class CorsExtensions
    {
        public static IServiceCollection AddCorsPolicy(this IServiceCollection services, IConfiguration configuration, string policyName)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(name: policyName,
                    policy =>
                    {
                        policy.WithOrigins(configuration.GetValue<string>("Frontend:Origin")!)
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    }
                );
            });

            return services;
        }
    }
}