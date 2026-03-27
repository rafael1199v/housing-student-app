using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.UnitOfWork;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Error;
using System.Globalization;

namespace HousingApp.Application.Auth.UseCases
{
    public class RegisterUseCase(IAuthUnitOfWork unitOfWork) : IRegisterUseCase
    {
        public async Task<Result<string>> ExecuteAsync(RegisterDto registerDto)
        {
            if (registerDto.Role.Equals("admin", StringComparison.CurrentCultureIgnoreCase))
                return Result<string>.Failure(RegisterError.DeniedAdminCreation);

            if (!Enum.TryParse<Domain.Enums.Roles>(registerDto.Role, true, out Domain.Enums.Roles role))
                return Result<string>.Failure(RegisterError.RolDoesNotExist);

            User? userFoundedByEmail = await unitOfWork.UserRepository.FindUserByEmailAsync(registerDto.Email);

            if (userFoundedByEmail is not null)
                return Result<string>.Failure(RegisterError.EmailAlreadyInUse);

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

                return Result<string>.Success(userId);
            }
            catch (Exception ex)
            {
                await unitOfWork.RollbackTransactionAsync();
                throw new Exception(ex.Message);
            }
        }
    }
}