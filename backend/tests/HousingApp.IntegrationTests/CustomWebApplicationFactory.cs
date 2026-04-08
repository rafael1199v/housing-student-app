using HousingApp.Infrastructure.Persistence.Context;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace HousingApp.IntegrationTests;

public class CustomWebApplicationFactory(string postgresConnectionString) : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            services.AddDbContext<HousingApplicationDbContext>(options =>
            {
                options.UseNpgsql(postgresConnectionString);
            });
        });
    }
}
