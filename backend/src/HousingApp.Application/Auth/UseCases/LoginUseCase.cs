using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Repositories;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Error;

namespace HousingApp.Application.Auth.UseCases;

public class LoginUseCase(IUserRepository userRepository, IGenerateRefreshTokenUseCase generateRefreshTokenUseCase) : ILoginUseCase
{
    public async Task<Result<UserDto>> Login(LoginDto loginDto)
    {
        User? user = await userRepository.FindUserByEmailAsync(loginDto.Email);

        if (user is null || !await userRepository.CheckPassword(loginDto.Email, loginDto.Password))
        {
            return Result<UserDto>.Failure(AuthError.InvalidCredentials);
        }

        Result<string> refreshTokenResult = await generateRefreshTokenUseCase.ExecuteAsync(user.Id);

        if (!refreshTokenResult.IsSuccess)
        {
            return Result<UserDto>.Failure(refreshTokenResult.Error);
        }

        UserDto userDto = new(
            Id: user.Id, Email: user.Email, RefreshToken: refreshTokenResult.Value!, Roles: user.Roles);

        return Result<UserDto>.Success(userDto);
    }
}
