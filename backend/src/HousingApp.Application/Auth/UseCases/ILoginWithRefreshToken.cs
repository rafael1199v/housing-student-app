using HousingApp.Application.Auth.DTOs;

namespace HousingApp.Application.Auth.UseCases;

public interface ILoginWithRefreshToken
{
    Task<Result<UserDto>> ExecuteAsync(RefreshTokenDto refreshTokenDto);
}
