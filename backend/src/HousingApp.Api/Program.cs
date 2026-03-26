using HousingApp.Api.Exception;
using HousingApp.Api.Extensions;
using Scalar.AspNetCore;
using System.Globalization;

CultureInfo culture = new("en-US");
CultureInfo.DefaultThreadCurrentCulture = culture;
CultureInfo.DefaultThreadCurrentUICulture = culture;

const string myAllowSpecificOrigins = "_myAllowSpecificOrigins";

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

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

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference("/docs");
}

//app.UseHttpsRedirection();
app.UseExceptionHandler(_ => { });
app.UseCors(myAllowSpecificOrigins);

app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();