namespace HousingApp.Application.Auth.UseCases;

public interface IGenerateRefreshTokenUseCase
{
    Task<Result<string>> GenerateRefreshToken(string userId);
}
