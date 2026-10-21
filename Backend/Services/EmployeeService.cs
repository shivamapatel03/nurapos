using Nurapos.DTOs.Employees;
using Nurapos.Helpers;
using Nurapos.Models;
using Nurapos.Repositories.Interfaces;
using Nurapos.Services.Interfaces;

namespace Nurapos.Services;

public sealed class EmployeeService(IEmployeeRepository repository) : IEmployeeService
{
    public Task<IReadOnlyList<Employee>> GetAllAsync(int ownerId, int? franchiseId) => repository.GetAllAsync(ownerId, franchiseId);
    public Task<Employee?> GetAsync(int ownerId, int employeeId) => repository.GetAsync(ownerId, employeeId);

    public Task<Employee> CreateAsync(int ownerId, CreateEmployeeRequest request)
    {
        var employee = new Employee
        {
            FranchiseId = request.FranchiseId,
            EmployeeCode = request.EmployeeCode.Trim(),
            Name = request.Name.Trim(),
            Role = request.Role.Trim(),
            Phone = NullIfBlank(request.Phone),
            Email = NullIfBlank(request.Email)?.ToLowerInvariant(),
            IsActive = true
        };
        var pinHash = request.InitialPin is null ? null : PasswordHelper.HashPassword(request.InitialPin);
        return repository.CreateAsync(employee, pinHash, ownerId);
    }

    public async Task<bool> UpdateAsync(int ownerId, int employeeId, UpdateEmployeeRequest request)
    {
        var employee = await repository.GetAsync(ownerId, employeeId);
        if (employee is null) return false;
        employee.Name = request.Name.Trim();
        employee.Role = request.Role.Trim();
        employee.Phone = NullIfBlank(request.Phone);
        employee.Email = NullIfBlank(request.Email)?.ToLowerInvariant();
        employee.IsActive = request.IsActive;
        return await repository.UpdateAsync(employee, ownerId);
    }

    public Task<bool> DeactivateAsync(int ownerId, int employeeId) => repository.DeactivateAsync(employeeId, ownerId);

    public Task<bool> ResetPinAsync(int ownerId, int employeeId, ResetEmployeePinRequest request) =>
        repository.SetPinAsync(employeeId, ownerId, PasswordHelper.HashPassword(request.Pin));

    private static string? NullIfBlank(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
