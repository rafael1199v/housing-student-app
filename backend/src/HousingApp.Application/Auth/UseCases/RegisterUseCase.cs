using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.UnitOfWork;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Repositories;
using System.Globalization;

namespace HousingApp.Application.Auth.UseCases
{
    public class RegisterUseCase(IAuthUnitOfWork unitOfWork) : IRegisterUseCase
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

            try
            {
                await unitOfWork.BeginTransactionAsync();

                string userId = await unitOfWork.UserRepository.RegisterUser(user, role);

                Person person = Person.CreatePerson(
                    id: userId,
                    firstName: registerDto.FirstName,
                    lastName: registerDto.LastName,
                    email: registerDto.Email,
                    phoneNumber: registerDto.PhoneNumber,
                    nationality: registerDto.Nationality,
                    gender: registerDto.Gender,
                    imageUrl: registerDto.ImageUrl,
                    birthDate: DateOnly.ParseExact(registerDto.BirthDate, "yyyy-MM-dd", CultureInfo.InvariantCulture),
                    age: registerDto.Age,
                    user: user
                );

                await unitOfWork.PersonRepository.CreatePerson(person);

                await unitOfWork.CommitTransactionAsync();

                return userId;
            }
            catch (Exception ex)
            {
                await unitOfWork.RollbackTransactionAsync();
                throw new Exception(ex.Message);
            }
        }
    }
}