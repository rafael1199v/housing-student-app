using HousingApp.Infrastructure.Persistence.Context;
using HousingApp.Infrastructure.Seeders;
using Microsoft.EntityFrameworkCore;

namespace HousingApp.Api.Extensions;

public static class DatabaseExtensions
{
    public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<HousingApplicationDbContext>(options =>
        {
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
                .UseSnakeCaseNamingConvention();
        });

        return services;
    }

    public static async Task ApplyMigrationsAndSeedDataAsync(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            using IServiceScope scope = app.Services.CreateScope();
            IHousingAppSeeder housingAppSeeder = scope.ServiceProvider.GetRequiredService<IHousingAppSeeder>();
            await housingAppSeeder.SeedAsync();
        }
    }
}
