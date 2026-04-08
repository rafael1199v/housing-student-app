using HousingApp.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using Testcontainers.PostgreSql;

namespace HousingApp.IntegrationTests;

public class PostgresSqlContainerFixture : IAsyncLifetime
{
    public PostgreSqlContainer Postgres { get; private set; } = new PostgreSqlBuilder("postgres:18.1").Build();

    public async Task InitializeAsync()
    {
        await Postgres.StartAsync();
        
        DbContextOptions<HousingApplicationDbContext> options = new DbContextOptionsBuilder<HousingApplicationDbContext>()
            .UseNpgsql(Postgres.GetConnectionString())
            .UseSnakeCaseNamingConvention()
            .Options;

        await using HousingApplicationDbContext context = new(options);
        await context.Database.MigrateAsync();
    }

    public async Task DisposeAsync() => await Postgres.DisposeAsync();
}
