using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Auth.UseCases;
using HousingApp.Application.Repositories;
using HousingApp.Application.Roles;
using HousingApp.Application.Services;
using HousingApp.Application.User.DTOs;
using HousingApp.Domain.Error;

namespace HousingApp.Application.User.UseCases;

public class AssignRoleToUserUseCase(
    IUserRepository userRepository,
    IGenerateRefreshTokenUseCase generateRefreshTokenUseCase,
    IAccessTokenService accessTokenService) : IAssignRoleToUserUseCase
{
    public async Task<Result<CredentialsDto>> ExecuteAsync(string userId, AssignRoleDto dto)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Result<CredentialsDto>.Failure(UserError.InvalidUserId);
        }

        if (!RoleHierarchy.IsKnownRole(dto.Role))
        {
            return Result<CredentialsDto>.Failure(UserError.InvalidRole);
        }

        Domain.Entities.User? user = await userRepository.GetUserByIdAsync(userId);

        if (user is null)
        {
            return Result<CredentialsDto>.Failure(UserError.UserNotFound);
        }

        if (user.Roles.Contains(dto.Role, StringComparer.OrdinalIgnoreCase))
        {
            return Result<CredentialsDto>.Failure(UserError.RoleAlreadyAssigned);
        }

        if (!RoleHierarchy.CanSelfAssign(user.Roles, dto.Role))
        {
            return Result<CredentialsDto>.Failure(UserError.RoleNotAssignable);
        }

        bool added = await userRepository.AddRoleToUserAsync(userId, dto.Role);

        if (!added)
        {
            return Result<CredentialsDto>.Failure(UserError.RoleAssignmentFailed);
        }

        // Re-read so the issued token authoritatively reflects the new role set.
        Domain.Entities.User? updatedUser = await userRepository.GetUserByIdAsync(userId);

        if (updatedUser is null)
        {
            return Result<CredentialsDto>.Failure(UserError.UserNotFound);
        }

        Result<string> refreshTokenResult = await generateRefreshTokenUseCase.ExecuteAsync(userId);

        if (!refreshTokenResult.IsSuccess)
        {
            return Result<CredentialsDto>.Failure(refreshTokenResult.Error);
        }

        UserDto userDto = new(
            Id: updatedUser.Id,
            Email: updatedUser.Email,
            RefreshToken: refreshTokenResult.Value!,
            Roles: updatedUser.Roles);

        return Result<CredentialsDto>.Success(new CredentialsDto(
            AccessToken: accessTokenService.GenerateAccessToken(userDto),
            RefreshToken: refreshTokenResult.Value!
        ));
    }
}
