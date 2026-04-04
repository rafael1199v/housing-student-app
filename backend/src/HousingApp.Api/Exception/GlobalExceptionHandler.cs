using HousingApp.Domain.Error;
using Microsoft.AspNetCore.Diagnostics;

namespace HousingApp.Api.Exception;

public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, System.Exception exception,
        CancellationToken cancellationToken)
    {
        logger.LogError(exception, "Exception occurred: {Message}", exception.Message);

        httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;

        await httpContext.Response.WriteAsJsonAsync(ServerError.UnknownError, cancellationToken);

        return true;
    }
}
