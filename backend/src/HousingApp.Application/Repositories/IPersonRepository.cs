using HousingApp.Domain.Entities;

namespace HousingApp.Application.Repositories;

public interface IPersonRepository
{
    Task CreatePerson(Person person);
    Task<bool> ExistsByUserIdAsync(string userId);
    Task<bool> UpdateUserDataAsync(
        string userId,
        string? firstName,
        string? lastName,
        string? phoneNumber,
        string? nationality,
        string? gender,
        DateOnly? birthDate);
}
