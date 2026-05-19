namespace HousingApp.Application.Auth.UseCases;

public interface IConfirmEmailUseCase
{
    Task<Result<bool>> ExecuteAsync(string userId, string token);
}
