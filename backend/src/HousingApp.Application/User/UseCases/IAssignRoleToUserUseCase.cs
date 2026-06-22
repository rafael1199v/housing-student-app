using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.User.DTOs;

namespace HousingApp.Application.User.UseCases;

public interface IAssignRoleToUserUseCase
{
    Task<Result<CredentialsDto>> ExecuteAsync(string userId, AssignRoleDto dto);
}
