using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Repositories;
using HousingApp.Application.Services;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Error;

namespace HousingApp.Application.Auth.UseCases;

public class LoginWithRefreshTokenUseCase(IRefreshTokenRepository refreshTokenRepository, IAccessTokenService accessTokenService) : ILoginWithRefreshTokenUseCase
{
    public async Task<Result<CredentialsDto>> ExecuteAsync(RefreshTokenDto refreshTokenDto)
    {
        RefreshToken? refreshToken = await refreshTokenRepository.FindRefreshToken(refreshTokenDto.RefreshToken);

        if (refreshToken == null || !refreshToken.IsValid())
            return Result<CredentialsDto>.Failure(AuthError.RefreshTokenExpired);

        RefreshToken renewedRefreshToken = refreshToken.Renew();

        await refreshTokenRepository.UpdateRefreshToken(renewedRefreshToken);

        UserDto userDto = new(
            Id: renewedRefreshToken.UserId,
            Email: renewedRefreshToken.User!.Email,
            RefreshToken: renewedRefreshToken.Token,
            Roles: renewedRefreshToken.User!.Roles
        );

        return Result<CredentialsDto>.Success(new CredentialsDto(
            AccessToken: accessTokenService.GenerateAccessToken(userDto),
            RefreshToken: renewedRefreshToken.Token
        ));
    }
}
