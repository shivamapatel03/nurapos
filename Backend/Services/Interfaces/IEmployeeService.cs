using Nurapos.DTOs.Employees;
using Nurapos.Models;

namespace Nurapos.Services.Interfaces;

public interface IEmployeeService
{
    Task<IReadOnlyList<Employee>> GetAllAsync(int ownerId, int? franchiseId);
    Task<Employee?> GetAsync(int ownerId, int employeeId);
    Task<Employee> CreateAsync(int ownerId, CreateEmployeeRequest request);
    Task<bool> UpdateAsync(int ownerId, int employeeId, UpdateEmployeeRequest request);
    Task<bool> DeactivateAsync(int ownerId, int employeeId);
    Task<bool> ResetPinAsync(int ownerId, int employeeId, ResetEmployeePinRequest request);
}
