using HousingApp.Application.Auth.DTOs;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Repositories;

namespace HousingApp.Application.Auth.UseCases
{
    public class RegisterUseCase(IUserRepository userRepository) : IRegisterUseCase
    {
        public async Task<string> ExecuteAsync(RegisterDto registerDto)
        {
            if(registerDto.Role.Equals("admin", StringComparison.CurrentCultureIgnoreCase))
                throw new Exception("No tienes permisos para crear una cuenta con estos privilegios");
            
            if (!Enum.TryParse<Domain.Enums.Roles>(registerDto.Role, true, out Domain.Enums.Roles role))
            {
                throw new Exception("El rol no existe");
            }
            
            User user = User.CreateUser(registerDto.Email, registerDto.Password);
            string userId = await userRepository.RegisterUser(user, role);

            return userId;
        }
    }
}