using HousingApp.Application.User.DTOs;
    
namespace HousingApp.Application.User.UseCases;

public interface IGetUserDataUseCase
{
    Task<Result<UserDataDto>> ExecuteAsync(string userId);
}