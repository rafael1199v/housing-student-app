using HousingApp.Application.Repositories;
using HousingApp.Application.User.DTOs;
using HousingApp.Domain.Error;
using System.Globalization;

namespace HousingApp.Application.User.UseCases;

public class UpdateUserDataUseCase(IPersonRepository personRepository, IUserRepository userRepository)
    : IUpdateUserDataUseCase
{
    public async Task<Result<bool>> ExecuteAsync(string userId, UpdateUserDTO updateUserDto)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Result<bool>.Failure(new Error("user.invalid.id", "User id is required."));
        }

        Result<Domain.Entities.User> userResult = await userRepository.GetByIdAsync(userId);
        if (!userResult.IsSuccess)
        {
            return Result<bool>.Failure(userResult.Error);
        }

        if (!DateOnly.TryParseExact(
                updateUserDto.Birthdate,
                "yyyy-MM-dd",
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out DateOnly birthDate))
        {
            return Result<bool>.Failure(new Error("user.invalid.birthdate", "Birthdate must be in yyyy-MM-dd format."));
        }

        bool updated = await personRepository.UpdateUserDataAsync(
            userId,
            updateUserDto.FirstName ?? string.Empty,
            updateUserDto.LastName ?? string.Empty,
            updateUserDto.PhoneNumber ?? string.Empty,
            updateUserDto.Nationality ?? string.Empty,
            updateUserDto.Gender ?? string.Empty,
            birthDate);

        if (!updated)
        {
            return Result<bool>.Failure(new Error("person.not.found", "Person profile not found."));
        }

        return Result<bool>.Success(true);
    }
}
