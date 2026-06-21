using HousingApp.Application.Services;
using HousingApp.Infrastructure.Persistence.Context;
using HousingApp.IntegrationTests.Fakes;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

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
                { "AWS:Region", "us-east-1" },
                { "Resend:ApiKey", "fake-resend-api-key-test" },
                { "Resend:FromEmail", "fakeEmail@gmail.com" },
            });
        });

        builder.ConfigureServices(services =>
        {
            services.AddDbContext<HousingApplicationDbContext>(options =>
            {
                options.UseNpgsql(postgresConnectionString);
            });

            services.Replace(ServiceDescriptor.Scoped<IRsaPasswordCipher, PassThroughPasswordCipher>());
        });
    }
}
