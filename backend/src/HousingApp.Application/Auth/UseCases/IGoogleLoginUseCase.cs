using HousingApp.Application.Auth.DTOs;

namespace HousingApp.Application.Auth.UseCases;

public interface IGoogleLoginUseCase
{
    Task<Result<GoogleAuthResponseDto>> ExecuteAsync(GoogleLoginDto googleLoginDto);
}
