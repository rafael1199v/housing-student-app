using HousingApp.Domain.Error;
using Microsoft.AspNetCore.Diagnostics;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace HousingApp.Api.Exception;

public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, System.Exception exception,
        CancellationToken cancellationToken)
    {
        string? userId =
            httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub)
            ?? httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

        logger.LogError(
            exception,
            "Unhandled exception for HTTP {Method} {Path} TraceId={TraceId} UserId={UserId}: {Message}",
            httpContext.Request.Method,
            httpContext.Request.Path.Value,
            httpContext.TraceIdentifier,
            userId ?? "anonymous",
            exception.Message);

        httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
        string traceId = Activity.Current?.TraceId.ToString() ?? httpContext.TraceIdentifier;
        httpContext.Response.Headers.Append("X-Trace-Id", traceId);

        await httpContext.Response.WriteAsJsonAsync(ServerError.UnknownError, cancellationToken);

        return true;
    }
}
