using HousingApp.Application.Auth.DTOs;

namespace HousingApp.Application.Auth.UseCases;

public interface IGoogleRegistrationUseCase
{
    Task<Result<CredentialsDto>> ExecuteAsync(GoogleRegisterDto googleRegisterDto);
}
