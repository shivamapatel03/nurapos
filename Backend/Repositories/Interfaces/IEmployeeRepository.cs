using Nurapos.Models;

namespace Nurapos.Repositories.Interfaces;

public interface IEmployeeRepository
{
    Task EnsureSchemaAsync();
    Task<IReadOnlyList<Employee>> GetAllAsync(int ownerId, int? franchiseId);
    Task<Employee?> GetAsync(int ownerId, int employeeId);
    Task<Employee> CreateAsync(Employee employee, string? pinHash, int ownerId);
    Task<bool> UpdateAsync(Employee employee, int ownerId);
    Task<bool> DeactivateAsync(int employeeId, int ownerId);
    Task<bool> SetPinAsync(int employeeId, int ownerId, string pinHash);
}
