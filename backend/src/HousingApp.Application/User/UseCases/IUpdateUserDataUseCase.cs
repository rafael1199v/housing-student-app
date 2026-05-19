using HousingApp.Application.User.DTOs;

namespace HousingApp.Application.User.UseCases;

public interface IUpdateUserDataUseCase
{
    Task<Result<bool>> ExecuteAsync(string userId, UpdateUserDTO updateUserDto);
}
