using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Services;
using HousingApp.Application.UnitOfWork;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Enums;
using HousingApp.Domain.Error;
using System.Globalization;

namespace HousingApp.Application.Auth.UseCases;

public class RegisterUseCase(IAuthUnitOfWork unitOfWork, IEmailService emailService) : IRegisterUseCase
{
    public async Task<Result<string>> ExecuteAsync(RegisterDto registerDto)
    {
        if (registerDto.Role.Equals("admin", StringComparison.CurrentCultureIgnoreCase))
        {
            return Result<string>.Failure(RegisterError.DeniedAdminCreation);
        }

        if (!Enum.TryParse(registerDto.Role, true, out Domain.Enums.Roles role))
        {
            return Result<string>.Failure(RegisterError.RolDoesNotExist);
        }

        User? userFoundedByEmail = await unitOfWork.UserRepository.FindUserByEmailAsync(registerDto.Email);

        if (userFoundedByEmail is not null)
        {
            return Result<string>.Failure(RegisterError.EmailAlreadyInUse);
        }

        User user = User.CreateUser(registerDto.Email, registerDto.Password);

        await unitOfWork.BeginTransactionAsync();

        try
        {
            string userId = await unitOfWork.UserRepository.RegisterUser(user, role);

            Person person = Person.CreatePerson(
                userId,
                registerDto.FirstName,
                registerDto.LastName,
                registerDto.Email,
                registerDto.PhoneNumber,
                registerDto.Nationality,
                gender: registerDto.Gender,
                imageUrl: registerDto.ImageUrl,
                birthDate: registerDto.BirthDate is null ? null : DateOnly.ParseExact(registerDto.BirthDate, "yyyy-MM-dd", CultureInfo.InvariantCulture),
                user: user
            );

            await unitOfWork.PersonRepository.CreatePerson(person);

            await unitOfWork.CommitTransactionAsync();

            await emailService.SendEmailAsync(person.Email, "Confirm your email", "<strong>Welcome to Itersapiens app. Please confirm your email</strong>");

            return Result<string>.Success(userId);
        }
        catch (Exception ex)
        {
            await unitOfWork.RollbackTransactionAsync();
            throw new Exception(ex.Message);
        }
    }
}
