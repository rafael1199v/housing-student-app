using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Repositories;
using HousingApp.Application.Services;
using HousingApp.Domain.Error;

namespace HousingApp.Application.Auth.UseCases;

public class LoginUseCase(IUserRepository userRepository, IGenerateRefreshTokenUseCase generateRefreshTokenUseCase, IAccessTokenService accessTokenService) : ILoginUseCase
{
    public async Task<Result<CredentialsDto>> Login(LoginDto loginDto)
    {
        Domain.Entities.User? user = await userRepository.FindUserByEmailAsync(loginDto.Email);

        if (user is null || user.IsExternalLogin || !await userRepository.CheckPassword(loginDto.Email, loginDto.Password))
            return Result<CredentialsDto>.Failure(AuthError.InvalidCredentials);

        if (!user.IsEmailConfirmed)
            return Result<CredentialsDto>.Failure(AuthError.EmailNotConfirmed);

        Result<string> refreshTokenResult = await generateRefreshTokenUseCase.ExecuteAsync(user.Id);

        if (!refreshTokenResult.IsSuccess)
            return Result<CredentialsDto>.Failure(refreshTokenResult.Error);

        UserDto userDto = new(Id: user.Id, Email: user.Email, RefreshToken: refreshTokenResult.Value!, Roles: user.Roles);

        return Result<CredentialsDto>.Success(new CredentialsDto(
            AccessToken: accessTokenService.GenerateAccessToken(userDto),
            RefreshToken: refreshTokenResult.Value!
        ));
    }
}
