using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Services;
using HousingApp.Application.UnitOfWork;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Error;
using Microsoft.Extensions.Logging;
using System.Globalization;

namespace HousingApp.Application.Auth.UseCases;

public class RegisterUseCase(IAuthUnitOfWork unitOfWork, IEmailService emailService, IAccountService accountService, ILogger<RegisterUseCase> logger) : IRegisterUseCase
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

        //Register user and person flow
        await unitOfWork.BeginTransactionAsync();
        Person person;
        string userId;

        try
        {
            userId = await unitOfWork.UserRepository.RegisterUser(user, role);

            person = Person.CreatePerson(
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
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }

        //Send confirmation email
        try
        {
            string confirmationToken = await unitOfWork.UserRepository.GenerateEmailConfirmationToken(userId);
            string confirmationLink =
                accountService.GenerateEmailConfirmationLinkAsync(userId: userId, token: confirmationToken);

            await emailService.SendConfirmationEmailAsync(to: person.Email, firstName: person.FirstName,
                confirmationLink: confirmationLink);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error sending confirmation email {Message}", ex.Message);
        }


        return Result<string>.Success(userId);
    }
}
