using Nurapos.Services.Interfaces;

namespace Nurapos.Services;

public sealed class LocalFileStorage(IConfiguration configuration, IWebHostEnvironment environment) : IFileStorage
{
    private string Root
    {
        get
        {
            var configured = configuration["Uploads:Path"];
            var root = string.IsNullOrWhiteSpace(configured)
                ? Path.Combine(environment.ContentRootPath, "App_Data", "uploads")
                : Path.GetFullPath(configured);
            Directory.CreateDirectory(root);
            return root;
        }
    }

    public async Task SaveAsync(string storedName, Stream content, CancellationToken cancellationToken)
    {
        var path = Resolve(storedName);
        await using var target = new FileStream(path, FileMode.CreateNew, FileAccess.Write, FileShare.None, 81920, useAsync: true);
        await content.CopyToAsync(target, cancellationToken);
    }

    public Task<Stream?> OpenReadAsync(string storedName, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        var path = Resolve(storedName);
        return Task.FromResult<Stream?>(File.Exists(path) ? new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read) : null);
    }

    public Task DeleteAsync(string storedName)
    {
        var path = Resolve(storedName);
        if (File.Exists(path)) File.Delete(path);
        return Task.CompletedTask;
    }

    private string Resolve(string storedName)
    {
        if (string.IsNullOrWhiteSpace(storedName) || Path.GetFileName(storedName) != storedName)
            throw new InvalidOperationException("Invalid stored asset name.");
        return Path.Combine(Root, storedName);
    }
}
