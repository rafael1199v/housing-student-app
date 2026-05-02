namespace HousingApp.Application.Auth.UseCases;

public interface ILogoutUseCase
{
    Task<Result<bool>> ExecuteAsync(string userId);
}
