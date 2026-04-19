using HousingApp.Application.Auth.DTOs;

namespace HousingApp.Application.Auth.UseCases;

public interface ILoginWithRefreshTokenUseCase
{
    Task<Result<UserDto>> ExecuteAsync(RefreshTokenDto refreshTokenDto);
}
