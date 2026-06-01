using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Repositories;
using HousingApp.Application.Services;
using HousingApp.Application.UnitOfWork;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Error;
using Microsoft.Extensions.Logging;

namespace HousingApp.Application.Auth.UseCases;

public class GoogleRegistrationUseCase(IGoogleAuthService googleAuthService, IAuthUnitOfWork authUnitOfWork, IGenerateRefreshTokenUseCase generateRefreshTokenUseCase, IAccessTokenService accessTokenService, ILogger<GoogleRegistrationUseCase> logger) : IGoogleRegistrationUseCase
{
    public async Task<Result<CredentialsDto>> ExecuteAsync(GoogleRegisterDto googleRegisterDto)
    {
        GoogleUserInfoDto? payload = await googleAuthService.ValidateAsync(googleRegisterDto.IdToken);

        if (payload is null)
            return Result<CredentialsDto>.Failure(GoogleAuthError.InvalidGoogleToken);

        if (googleRegisterDto.Role.Equals("admin", StringComparison.CurrentCultureIgnoreCase))
            return Result<CredentialsDto>.Failure(RegisterError.DeniedAdminCreation);

        if (!Enum.TryParse(googleRegisterDto.Role, true, out Domain.Enums.Roles role))
            return Result<CredentialsDto>.Failure(RegisterError.RolDoesNotExist);

        Domain.Entities.User? userFoundedByEmail = await authUnitOfWork.UserRepository.FindUserByEmailAsync(payload.Email);

        if (userFoundedByEmail is not null)
            return Result<CredentialsDto>.Failure(RegisterError.EmailAlreadyInUse);

        Domain.Entities.User user = Domain.Entities.User.CreateExternalLoginUser(payload.Email);

        try
        {
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
            logger.LogInformation("Google user registered UserId={UserId} Role={Role}", userId, role);

            Domain.Entities.User? userCreated = await authUnitOfWork.UserRepository.GetUserByIdAsync(userId);

            Result<string> refreshTokenResult = await generateRefreshTokenUseCase.ExecuteAsync(userId);

            if (!refreshTokenResult.IsSuccess)
                return Result<CredentialsDto>.Failure(refreshTokenResult.Error);

            UserDto userDto = new(
                Id: userCreated!.Id,
                Email: userCreated.Email,
                RefreshToken: refreshTokenResult.Value!,
                Roles: userCreated.Roles
            );

            return Result<CredentialsDto>.Success(new CredentialsDto(
                AccessToken: accessTokenService.GenerateAccessToken(userDto),
                RefreshToken: refreshTokenResult.Value!
            ));
        }
        catch (Exception ex)
        {
            await authUnitOfWork.RollbackTransactionAsync();
            logger.LogError(ex, "Google registration failed during transaction");
            throw;
        }
    }
}
