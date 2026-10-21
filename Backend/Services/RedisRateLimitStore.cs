using Nurapos.Services.Interfaces;
using StackExchange.Redis;

namespace Nurapos.Services;

public sealed class RedisRateLimitStore(IConnectionMultiplexer redis):IRedisRateLimitStore
{
    public async Task<bool> TryAcquireAsync(string key,int limit,TimeSpan window,CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        const string script="local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]); end; return n";
        var count=await redis.GetDatabase().ScriptEvaluateAsync(script,[key],[(int)Math.Ceiling(window.TotalSeconds)]);
        return (long)count<=limit;
    }
}

public sealed class UnconfiguredRedisRateLimitStore:IRedisRateLimitStore
{
    public Task<bool> TryAcquireAsync(string key,int limit,TimeSpan window,CancellationToken cancellationToken)=>Task.FromResult(true);
}
