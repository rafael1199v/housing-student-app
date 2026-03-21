using HousingApp.Application.Auth.DTOs;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Error;
using HousingApp.Domain.Repositories;

namespace HousingApp.Application.Auth.UseCases
{
    public class LoginUseCase(IUserRepository userRepository) : ILoginUseCase
    {
        public async Task<Result<UserDto>> Login(LoginDto loginDto)
        {
            User? user = await userRepository.FindUserByEmailAsync(loginDto.Email);

            if (user is null)
            {
                return Result<UserDto>.Failure(AuthError.InvalidCredentials);
            }

            UserDto userDto = new(
                Id: user.Id, Email: user.Email, PasswordHash: user.Password, Roles: user.Roles);

            if (!await userRepository.CheckPassword(loginDto.Email, loginDto.Password))
            {
                return Result<UserDto>.Failure(AuthError.InvalidCredentials);
            }

            return Result<UserDto>.Success(userDto);
        }
    }
}