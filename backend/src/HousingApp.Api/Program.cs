using HousingApp.Api.Exception;
using HousingApp.Api.Extensions;
using Scalar.AspNetCore;
using Serilog;
using Serilog.Events;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

CultureInfo culture = new("en-US");
CultureInfo.DefaultThreadCurrentCulture = culture;
CultureInfo.DefaultThreadCurrentUICulture = culture;

const string myAllowSpecificOrigins = "_myAllowSpecificOrigins";

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

builder.Services.AddDatabase(builder.Configuration);
builder.Services.AddIdentityConfiguration();
builder.Services.AddJwtAuthentication(builder.Configuration);

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddCorsPolicy(builder.Configuration, myAllowSpecificOrigins);
builder.Services.AddAwsStorage(builder.Configuration);
builder.Services.AddApplicationServices();
builder.Services.AddRateLimiterPolicy();
builder.Services.AddFluentValidation();
builder.Services.AddEmailConfiguration(builder.Configuration);

builder.Services.AddAuthorization();

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

app.UseSerilogRequestLogging(options =>
{
    options.MessageTemplate =
        "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms TraceId={TraceId} UserId={UserId}";

    options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
    {
        string? userId =
            httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub)
            ?? httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

        diagnosticContext.Set("TraceId", httpContext.TraceIdentifier);
        diagnosticContext.Set("UserId", userId ?? "anonymous");
    };
});
app.UseCors(myAllowSpecificOrigins);

app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

static LogEventLevel GetLogLevel(IConfiguration configuration, string key, LogEventLevel fallback)
{
    string? configuredValue = configuration[key];

    return Enum.TryParse(configuredValue, ignoreCase: true, out LogEventLevel level)
        ? level
        : fallback;
}
