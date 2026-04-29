using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Repositories;
using HousingApp.Application.Services;
using HousingApp.Application.UnitOfWork;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Error;

namespace HousingApp.Application.Auth.UseCases;

public class GoogleRegistrationUseCase(IGoogleAuthService googleAuthService, IAuthUnitOfWork authUnitOfWork, IGenerateRefreshTokenUseCase generateRefreshTokenUseCase) : IGoogleRegistrationUseCase
{
    public async Task<Result<UserDto>> ExecuteAsync(GoogleRegisterDto googleRegisterDto)
    {
        //Check if the token is valid
        GoogleUserInfoDto? payload = await googleAuthService.ValidateAsync(googleRegisterDto.IdToken);

        if (payload is null)
            return Result<UserDto>.Failure(GoogleAuthError.InvalidGoogleToken);

        //Check user role
        if (googleRegisterDto.Role.Equals("admin", StringComparison.CurrentCultureIgnoreCase))
        {
            return Result<UserDto>.Failure(RegisterError.DeniedAdminCreation);
        }

        if (!Enum.TryParse(googleRegisterDto.Role, true, out Domain.Enums.Roles role))
        {
            return Result<UserDto>.Failure(RegisterError.RolDoesNotExist);
        }

        //Check if the user already exists
        Domain.Entities.User? userFoundedByEmail = await authUnitOfWork.UserRepository.FindUserByEmailAsync(payload.Email);

        if (userFoundedByEmail is not null)
        {
            return Result<UserDto>.Failure(RegisterError.EmailAlreadyInUse);
        }

        //User creation
        Domain.Entities.User user = Domain.Entities.User.CreateExternalLoginUser(payload.Email);

        try
        {
            //Transaction applied
            await authUnitOfWork.BeginTransactionAsync();

            string userId = await authUnitOfWork.UserRepository.RegisterExternalUser(user, role);

            Person person = Person.CreatePerson(
                userId,
                payload.FullName,
                null,
                payload.Email,
                null,
                null,
                gender: null,
                imageUrl: payload.Picture,
                birthDate: null,
                user: user
            );

            await authUnitOfWork.PersonRepository.CreatePerson(person);
            await authUnitOfWork.CommitTransactionAsync();

            //Generate user data for credentials creation
            Domain.Entities.User? userCreated = await authUnitOfWork.UserRepository.GetUserByIdAsync(userId);

            Result<string> refreshTokenResult = await generateRefreshTokenUseCase.ExecuteAsync(userId);

            if (!refreshTokenResult.IsSuccess)
                return Result<UserDto>.Failure(refreshTokenResult.Error);

            UserDto userDto = new(
                Id: userCreated!.Id,
                Email: userCreated.Email,
                RefreshToken: refreshTokenResult.Value!,
                Roles: userCreated.Roles
            );

            return Result<UserDto>.Success(userDto);
        }
        catch (Exception ex)
        {
            await authUnitOfWork.RollbackTransactionAsync();
            throw new Exception(ex.Message);
        }

        throw new NotImplementedException();
    }
}
