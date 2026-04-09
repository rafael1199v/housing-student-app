using HousingApp.Application.Auth.DTOs;

namespace HousingApp.Application.Auth.UseCases;

public interface IRegisterUseCase
{
    Task<Result<string>> ExecuteAsync(RegisterDto registerDto);
}
