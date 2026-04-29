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


        bool updated = await personRepository.UpdateUserDataAsync(
            userId,
            updateUserDto.FirstName,
            updateUserDto.LastName,
            updateUserDto.PhoneNumber,
            updateUserDto.Nationality,
            updateUserDto.Gender,
            birthDate: updateUserDto.Birthdate is null ? null : DateOnly.ParseExact(updateUserDto.Birthdate, "yyyy-MM-dd", CultureInfo.InvariantCulture)
            );

        if (!updated)
        {
            return Result<bool>.Failure(new Error("person.not.found", "Person profile not found."));
        }

        return Result<bool>.Success(true);
    }
}
