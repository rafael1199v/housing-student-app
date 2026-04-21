using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Repositories;
using HousingApp.Application.Services;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Error;

namespace HousingApp.Application.Auth.UseCases;

public class GoogleLoginUseCase(IGoogleAuthService googleAuthService, IUserRepository userRepository, IGenerateRefreshTokenUseCase generateRefreshTokenUseCase) : IGoogleLoginUseCase
{
    public async Task<Result<GoogleAuthResponseDto>> ExecuteAsync(GoogleLoginDto googleLoginDto)
    {
        GoogleUserInfoDto? payload = await googleAuthService.ValidateAsync(googleLoginDto.IdToken);

        if (payload is null)
            return Result<GoogleAuthResponseDto>.Failure(GoogleAuthError.InvalidGoogleToken);

        User? user = await userRepository.FindUserByEmailAsync(payload.Email);

        if (user is null)
            return Result<GoogleAuthResponseDto>.Success(new GoogleAuthResponseDto(
                IsNewUser: true,
                UserDto: null
            ));

        Result<string> refreshTokenResult = await generateRefreshTokenUseCase.ExecuteAsync(user.Id);

        if (!refreshTokenResult.IsSuccess)
            return Result<GoogleAuthResponseDto>.Failure(refreshTokenResult.Error);

        return Result<GoogleAuthResponseDto>.Success(new GoogleAuthResponseDto(
            IsNewUser: false,
            UserDto: new UserDto(
                Id: user.Id,
                Email: user.Email,
                RefreshToken: refreshTokenResult.Value!,
                Roles: user.Roles
            )
        ));
    }
}
