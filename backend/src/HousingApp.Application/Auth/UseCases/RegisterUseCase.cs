using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Services;
using HousingApp.Application.UnitOfWork;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Enums;
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

        Domain.Entities.User? userFoundedByEmail = await unitOfWork.UserRepository.FindUserByEmailAsync(registerDto.Email);

        if (userFoundedByEmail is not null)
        {
            return Result<string>.Failure(RegisterError.EmailAlreadyInUse);
        }

        Domain.Entities.User user = Domain.Entities.User.CreateUser(registerDto.Email, registerDto.Password);

        //Register user and person flow
        await unitOfWork.BeginTransactionAsync();
        Person person;
        string userId;

        try
        {
            userId = await unitOfWork.UserRepository.RegisterUser(user, role);

            person = Person.CreatePerson(
                id: userId,
                firstName: registerDto.FirstName,
                lastName: registerDto.LastName,
                email: registerDto.Email,
                avatarSource: AvatarSource.None,
                phoneNumber: registerDto.PhoneNumber,
                nationality: registerDto.Nationality,
                gender: registerDto.Gender,
                imageUrl: registerDto.ImageUrl,
                birthDate: registerDto.BirthDate is null ? null : DateOnly.ParseExact(registerDto.BirthDate, "yyyy-MM-dd", CultureInfo.InvariantCulture),
                user: user
            );

            await unitOfWork.PersonRepository.CreatePerson(person);
            await unitOfWork.CommitTransactionAsync();

            logger.LogInformation("User registered UserId={UserId} Role={Role}", userId, role);
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
            logger.LogWarning(ex, "Confirmation email could not be sent UserId={UserId}: {Message}", userId, ex.Message);
        }


        return Result<string>.Success(userId);
    }
}
