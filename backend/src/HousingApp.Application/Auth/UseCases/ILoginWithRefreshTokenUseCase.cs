using HousingApp.Application.Auth.DTOs;

namespace HousingApp.Application.Auth.UseCases;

public interface ILoginWithRefreshTokenUseCase
{
    Task<Result<CredentialsDto>> ExecuteAsync(RefreshTokenDto refreshTokenDto);
}
