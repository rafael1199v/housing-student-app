using HousingApp.Application.Auth.DTOs;

namespace HousingApp.Application.Auth.UseCases
{
    public interface IRegisterUseCase
    {
        Task<string> ExecuteAsync(RegisterDto registerDto);
    }
}