namespace Nurapos.Services.Interfaces;

public interface IFileStorage
{
    Task SaveAsync(string storedName, Stream content, CancellationToken cancellationToken);
    Task<Stream?> OpenReadAsync(string storedName, CancellationToken cancellationToken);
    Task DeleteAsync(string storedName);
}
