using HousingApp.Domain.Entities;
using HousingApp.Domain.Enums;

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
    Task<bool> UpdateAvatarAsync(string userId, string imageUrl, AvatarSource avatarSource);
}
