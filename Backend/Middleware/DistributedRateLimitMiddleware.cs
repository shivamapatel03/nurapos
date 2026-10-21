using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using StackExchange.Redis;
using Nurapos.DTOs;
using Nurapos.Services.Interfaces;

namespace Nurapos.Middleware;

public sealed class DistributedRateLimitMiddleware(RequestDelegate next,ILogger<DistributedRateLimitMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context,IRedisRateLimitStore store)
    {
        var policy=context.GetEndpoint()?.Metadata.GetMetadata<DistributedRateLimitAttribute>();
        if(policy is null){await next(context);return;}
        var ip=context.Connection.RemoteIpAddress?.ToString()??"unknown";
        var identifier=await ReadIdentifierAsync(context);
        var idHash=Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(identifier))).ToLowerInvariant();
        var path=context.Request.Path.Value?.ToLowerInvariant()??"/";
        bool allowed;
        try
        {
            var window=TimeSpan.FromSeconds(policy.WindowSeconds);
            allowed=await store.TryAcquireAsync($"nurapos:rate:ip:{path}:{ip}",policy.PermitLimit,window,context.RequestAborted);
            if(allowed&&!string.IsNullOrEmpty(identifier))
                allowed=await store.TryAcquireAsync($"nurapos:rate:account:{path}:{idHash}",policy.PermitLimit,window,context.RequestAborted);
        }
        catch(Exception ex) when(ex is not OperationCanceledException)
        {
            var failureType = ex is RedisConnectionException redisException
                ? redisException.FailureType.ToString()
                : ex.GetType().Name;
            logger.LogError("Redis rate-limit check failed for {Path}. FailureType: {FailureType}. TraceId: {TraceId}",
                context.Request.Path, failureType, context.TraceIdentifier);
            context.Response.StatusCode=StatusCodes.Status503ServiceUnavailable;
            await context.Response.WriteAsJsonAsync(new ApiResponse<object?>{StatusCode=503,Message="Request throttling is temporarily unavailable. Please retry shortly.",TraceId=context.TraceIdentifier});
            return;
        }
        if(!allowed)
        {
            context.Response.StatusCode=StatusCodes.Status429TooManyRequests;
            context.Response.Headers.RetryAfter=policy.WindowSeconds.ToString();
            await context.Response.WriteAsJsonAsync(new ApiResponse<object?>{StatusCode=429,Message="Too many requests. Please try again later.",TraceId=context.TraceIdentifier});
            return;
        }
        await next(context);
    }

    private static async Task<string> ReadIdentifierAsync(HttpContext context)
    {
        if(!context.Request.HasJsonContentType())return "";
        context.Request.EnableBuffering();
        using var reader=new StreamReader(context.Request.Body,Encoding.UTF8,detectEncodingFromByteOrderMarks:false,bufferSize:1024,leaveOpen:true);
        var buffer=new char[4097];
        var count=await reader.ReadAsync(buffer.AsMemory(),context.RequestAborted);
        context.Request.Body.Position=0;
        if(count>4096)return "";
        try
        {
            using var json=JsonDocument.Parse(new string(buffer,0,count));
            var parts=new List<string>();
            foreach(var property in json.RootElement.EnumerateObject())
                if((property.Value.ValueKind is JsonValueKind.String or JsonValueKind.Number)
                    && (property.Name.Equals("email",StringComparison.OrdinalIgnoreCase)
                        ||property.Name.Equals("employeeId",StringComparison.OrdinalIgnoreCase)
                        ||property.Name.Equals("terminalId",StringComparison.OrdinalIgnoreCase)))
                    parts.Add($"{property.Name.ToLowerInvariant()}:{property.Value.ToString().Trim().ToLowerInvariant()}");
            return string.Join('|',parts);
        }
        catch(JsonException){ }
        return "";
    }
}
