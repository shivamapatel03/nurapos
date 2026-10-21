namespace Nurapos.Middleware;

[AttributeUsage(AttributeTargets.Method)]
public sealed class DistributedRateLimitAttribute(int permitLimit,int windowSeconds):Attribute
{
    public int PermitLimit { get; } = permitLimit;
    public int WindowSeconds { get; } = windowSeconds;
}
