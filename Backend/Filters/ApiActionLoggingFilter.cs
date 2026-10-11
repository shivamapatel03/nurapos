using System.Diagnostics;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Nurapos.Filters;

public sealed class ApiActionLoggingFilter : IAsyncActionFilter
{
    private readonly ILogger<ApiActionLoggingFilter> _logger;

    public ApiActionLoggingFilter(ILogger<ApiActionLoggingFilter> logger)
    {
        _logger = logger;
    }

    public async Task OnActionExecutionAsync(
        ActionExecutingContext context,
        ActionExecutionDelegate next)
    {
        var timer = Stopwatch.StartNew();
        var result = await next();
        timer.Stop();

        _logger.LogInformation(
            "API action {Controller}.{Action} completed with status {StatusCode} in {ElapsedMilliseconds} ms. TraceId: {TraceId}",
            context.RouteData.Values["controller"],
            context.RouteData.Values["action"],
            result.HttpContext.Response.StatusCode,
            timer.ElapsedMilliseconds,
            result.HttpContext.TraceIdentifier);
    }
}
