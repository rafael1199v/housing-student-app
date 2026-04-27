using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Repositories;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Error;
using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography.X509Certificates;

namespace HousingApp.Application.Auth.UseCases;

public class LoginWithRefreshTokenUseCase(IRefreshTokenRepository refreshTokenRepository) : ILoginWithRefreshTokenUseCase
{
    public async Task<Result<UserDto>> ExecuteAsync(RefreshTokenDto refreshTokenDto)
    {
        RefreshToken? refreshToken = await refreshTokenRepository.FindRefreshToken(refreshTokenDto.RefreshToken);

        if (refreshToken == null || !refreshToken.IsValid())
        {
            return Result<UserDto>.Failure(AuthError.RefreshTokenExpired);
        }

        RefreshToken renewedRefreshToken = refreshToken.Renew();

        await refreshTokenRepository.UpdateRefreshToken(renewedRefreshToken);

        UserDto userDto = new(
            Id: renewedRefreshToken.UserId,
            Email: renewedRefreshToken.User!.Email,
            RefreshToken: renewedRefreshToken.Token,
            Roles: renewedRefreshToken.User!.Roles
        );

        return Result<UserDto>.Success(userDto);
    }
}
