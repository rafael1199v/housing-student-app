namespace HousingApp.Application.Auth.UseCases;

public interface IGenerateRefreshTokenUseCase
{
    Task<Result<string>> ExecuteAsync(string userId);
}
