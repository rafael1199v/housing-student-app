using FluentAssertions;
using HousingApp.Application.Auth.DTOs;
using HousingApp.Domain.Error;
using HousingApp.Infrastructure.Persistence.Context;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Net.Http.Json;

namespace HousingApp.IntegrationTests.Auth;

[CollectionDefinition(nameof(IntegrationTestsCollection))]
public class IntegrationTestsCollection : ICollectionFixture<PostgresSqlContainerFixture> {}

[Collection(nameof(IntegrationTestsCollection))]
public class LoginTests : IAsyncLifetime
{
    private readonly CustomWebApplicationFactory _factory;
    private readonly HttpClient _client;
    private readonly HousingApplicationDbContext _context;

    public LoginTests(PostgresSqlContainerFixture fixture)
    {
        this._factory = new CustomWebApplicationFactory(fixture.Postgres.GetConnectionString());
        this._client = this._factory.CreateClient();
        
        IServiceScope scope = this._factory.Services.CreateScope();
        _context = scope.ServiceProvider.GetRequiredService<HousingApplicationDbContext>();
    }
    
    [Fact]
    public async Task Login_WhenUserDoesNotExist_ShouldReturnNotFound()
    {
        //Arrange
        LoginDto loginDto = new("userDoesNotExist@gmail.com", "Password!555");
        
        //Act
        HttpResponseMessage response = await _client.PostAsJsonAsync("/api/login", loginDto);
        Error? error = await response.Content.ReadFromJsonAsync<Error>();
        
        //Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        error.Should().NotBeNull();
        error.Should().BeEquivalentTo(AuthError.InvalidCredentials);
    }
    
    public Task InitializeAsync() {
        return Task.CompletedTask;
    }

    public Task DisposeAsync()
    {
        this._client.Dispose();
        this._factory.Dispose();
        return Task.CompletedTask;
    }
}
