namespace Nurapos.Services.Interfaces;

public interface IRedisRateLimitStore
{
    Task<bool> TryAcquireAsync(string key,int limit,TimeSpan window,CancellationToken cancellationToken);
}
