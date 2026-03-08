using HousingApp.Application.Auth.DTOs;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Repositories;

namespace HousingApp.Application.Auth.UseCases
{
    public class LoginUseCase(IUserRepository userRepository) : ILoginUseCase
    {
        public async Task<UserDto> Login(LoginDto loginDto)
        {
            User user = await userRepository.FindUserByEmailAsync(loginDto.Email);

            UserDto userDto = new(
                Id: user.Id, Email: user.Email, PasswordHash: user.Password, Roles: user.Roles);

            if (!await userRepository.CheckPassword(loginDto.Email, loginDto.Password))
            {
                throw new Exception("Credenciales invalidas");
            }
            
            return userDto;
        }
    }
}