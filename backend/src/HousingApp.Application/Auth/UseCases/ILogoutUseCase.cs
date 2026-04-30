using HousingApp.Application;

public interface ILogoutUseCase
{
    Task<Result<bool>> ExecuteAsync(string userId);
}