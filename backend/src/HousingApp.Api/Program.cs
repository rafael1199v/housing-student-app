using HousingApp.Api.Exception;
using HousingApp.Api.Extensions;
using Scalar.AspNetCore;
using System.Globalization;

CultureInfo culture = new("en-US");
CultureInfo.DefaultThreadCurrentCulture = culture;
CultureInfo.DefaultThreadCurrentUICulture = culture;

const string myAllowSpecificOrigins = "_myAllowSpecificOrigins";

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Host.AddSerilogConfiguration(builder.Configuration, builder.Environment);

builder.Services.AddDatabase(builder.Configuration);
builder.Services.AddIdentityConfiguration();
builder.Services.AddJwtAuthentication(builder.Configuration);

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddCorsPolicy(builder.Configuration, myAllowSpecificOrigins);
builder.Services.AddAwsConfiguration(builder.Configuration);
builder.Services.AddApplicationServices();
builder.Services.AddRateLimiterPolicy();
builder.Services.AddFluentValidation();
builder.Services.AddEmailConfiguration(builder.Configuration);

builder.Services.AddAuthorization();
builder.Services.AddOpenTelemetryMonitoringTools(builder.Configuration, builder.Environment);

WebApplication app = builder.Build();

//Apply database migrations and seed data only
await app.ApplyMigrationsAndSeedDataAsync();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference("/docs");
}

//app.UseHttpsRedirection();

app.UseExceptionHandler(_ => { });

app.UseSerilogRequestLoggingSetup();
app.UseCors(myAllowSpecificOrigins);

app.UseHttpsRedirection();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
