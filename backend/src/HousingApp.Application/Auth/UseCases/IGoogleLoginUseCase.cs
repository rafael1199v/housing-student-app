using HousingApp.Application.Auth.DTOs;

namespace HousingApp.Application.Auth.UseCases;

public interface IGoogleLoginUseCase
{
    Task<Result<GoogleAuthDto>> ExecuteAsync(GoogleLoginDto googleLoginDto);
}
