using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Repositories;
using HousingApp.Application.Services;
using HousingApp.Domain.Error;

namespace HousingApp.Application.Auth.UseCases;

public class GoogleLoginUseCase(IGoogleAuthService googleAuthService, IUserRepository userRepository, IGenerateRefreshTokenUseCase generateRefreshTokenUseCase, IAccessTokenService accessTokenService) : IGoogleLoginUseCase
{
    public async Task<Result<GoogleAuthDto>> ExecuteAsync(GoogleLoginDto googleLoginDto)
    {
        GoogleUserInfoDto? payload = await googleAuthService.ValidateAsync(googleLoginDto.IdToken);

        if (payload is null)
            return Result<GoogleAuthDto>.Failure(GoogleAuthError.InvalidGoogleToken);

        Domain.Entities.User? user = await userRepository.FindUserByEmailAsync(payload.Email);

        if (user is null)
            return Result<GoogleAuthDto>.Success(new GoogleAuthDto(IsNewUser: true, Credentials: null));

        Result<string> refreshTokenResult = await generateRefreshTokenUseCase.ExecuteAsync(user.Id);

        if (!refreshTokenResult.IsSuccess)
            return Result<GoogleAuthDto>.Failure(refreshTokenResult.Error);

        UserDto userDto = new(
            Id: user.Id,
            Email: user.Email,
            RefreshToken: refreshTokenResult.Value!,
            Roles: user.Roles
        );

        return Result<GoogleAuthDto>.Success(new GoogleAuthDto(
            IsNewUser: false,
            Credentials: new CredentialsDto(
                AccessToken: accessTokenService.GenerateAccessToken(userDto),
                RefreshToken: refreshTokenResult.Value!
            )
        ));
    }
}
