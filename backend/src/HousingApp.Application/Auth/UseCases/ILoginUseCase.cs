using HousingApp.Application.Auth.DTOs;

namespace HousingApp.Application.Auth.UseCases;

public interface ILoginUseCase
{
    Task<Result<UserDto>> Login(LoginDto user);
}
