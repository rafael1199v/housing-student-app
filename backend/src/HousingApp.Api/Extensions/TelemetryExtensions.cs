using HousingApp.Api.Options;
using Npgsql;
using OpenTelemetry;
using OpenTelemetry.Exporter;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Serilog;
using Serilog.Sinks.OpenTelemetry;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace HousingApp.Api.Extensions;

public static class TelemetryExtensions
{
    public static IServiceCollection AddOpenTelemetryMonitoringTools(this IServiceCollection services,
        IConfiguration configuration, IHostEnvironment hostEnvironment)
    {
        OpenTelemetryOptions? openTelemetryOptions =
            configuration.GetSection("OpenTelemetry").Get<OpenTelemetryOptions>();

        bool telemetryEnabled = openTelemetryOptions is { Endpoint: not null, Headers: not null };

        IOpenTelemetryBuilder otelBuilder = services.AddOpenTelemetry()
            .ConfigureResource(r => r.AddService("HousingApp.Api"))
            .WithMetrics(metrics =>
                metrics
                    .AddAspNetCoreInstrumentation()
                    .AddHttpClientInstrumentation()
                    .AddNpgsqlInstrumentation())
            .WithTracing(tracing =>
                tracing
                    .AddHttpClientInstrumentation()
                    .AddAspNetCoreInstrumentation()
                    .AddEntityFrameworkCoreInstrumentation()
                    .AddNpgsql());

        if (telemetryEnabled && hostEnvironment.IsProduction())
        {
            otelBuilder
                .WithMetrics(metrics =>
                    metrics.AddOtlpExporter((options, _) =>
                        ConfigureOtlpExporter(options, openTelemetryOptions!, "/v1/metrics")))
                .WithTracing(tracing =>
                    tracing.AddOtlpExporter(options =>
                        ConfigureOtlpExporter(options, openTelemetryOptions!, "/v1/traces")));
        }

        return services;
    }

    private static void ConfigureOtlpExporter(OtlpExporterOptions options,
        OpenTelemetryOptions telemetryOptions, string signalPath)
    {
        options.Endpoint = new Uri($"{telemetryOptions.Endpoint!.TrimEnd('/')}{signalPath}");
        options.Protocol = OtlpExportProtocol.HttpProtobuf;
        options.Headers = telemetryOptions.Headers;
    }

    public static ConfigureHostBuilder AddSerilogConfiguration(this ConfigureHostBuilder host,
        IConfiguration configuration, IHostEnvironment hostEnvironment)
    {
        OpenTelemetryOptions? openTelemetryOptions =
            configuration.GetSection("OpenTelemetry").Get<OpenTelemetryOptions>();

        bool telemetryEnabled = openTelemetryOptions is { Endpoint: not null, Headers: not null };

        host.UseSerilog((context, loggerConfiguration) =>
        {
            loggerConfiguration.ReadFrom.Configuration(context.Configuration);

            if (telemetryEnabled && hostEnvironment.IsProduction())
            {
                loggerConfiguration.WriteTo.OpenTelemetry(options =>
                {
                    options.Endpoint = $"{openTelemetryOptions!.Endpoint}/v1/logs";
                    options.Protocol = OtlpProtocol.HttpProtobuf;

                    int index = openTelemetryOptions.Headers!.IndexOf('=');
                    options.Headers.Add(openTelemetryOptions.Headers[..index], openTelemetryOptions.Headers[(index + 1)..]);

                    options.ResourceAttributes.Add("service.name", "HousingApp.Api");
                });
            }
        });

        return host;
    }

    public static void UseSerilogRequestLoggingSetup(this IApplicationBuilder app)
    {
        app.UseSerilogRequestLogging(options =>
        {
            options.MessageTemplate =
                "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms TraceId={TraceId} UserId={UserId}";

            options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
            {
                string? userId =
                    httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                    ?? httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

                diagnosticContext.Set("UserId", userId ?? "anonymous");
            };
        });
    }
}
