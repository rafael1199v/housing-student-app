using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Repositories;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Error;
using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography.X509Certificates;

namespace HousingApp.Application.Auth.UseCases;

public class LoginWithRefreshToken(IRefreshTokenRepository refreshTokenRepository) : ILoginWithRefreshToken
{
    public async Task<Result<UserDto>> ExecuteAsync(RefreshTokenDto refreshTokenDto)
    {
        RefreshToken? refreshToken = await refreshTokenRepository.FindRefreshToken(refreshTokenDto.RefreshToken);

        if (refreshToken == null || !refreshToken.IsValid())
        {
            return Result<UserDto>.Failure(AuthError.RefreshTokenExpired);
        }

        RefreshToken renewedRefreshToken = refreshToken.Renew();

        UserDto userDto = new(
            Id: renewedRefreshToken.UserId,
            Email: renewedRefreshToken.User!.Email,
            PasswordHash: renewedRefreshToken.User!.Password,
            RefreshToken: renewedRefreshToken.Token,
            Roles: renewedRefreshToken.User!.Roles
        );

        return Result<UserDto>.Success(userDto);
    }
}
