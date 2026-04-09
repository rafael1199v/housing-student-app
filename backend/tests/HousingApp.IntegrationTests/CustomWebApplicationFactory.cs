using HousingApp.Infrastructure.Persistence.Context;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HousingApp.IntegrationTests;

public class CustomWebApplicationFactory(string postgresConnectionString) : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureAppConfiguration((context, config) =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                { "Jwt:SecretKey", "long-key-for-integration-tests-itersapiens-backend-app" },
                { "AWS:AccessKey", "fake-access-key-test" },
                { "AWS:SecretKey", "fake-secret-key-test" },
                { "AWS:Region", "us-east-1" }
            });
        });
        
        builder.ConfigureServices(services =>
        {
            services.AddDbContext<HousingApplicationDbContext>(options =>
            {
                options.UseNpgsql(postgresConnectionString);
            });
        });
    }
}
