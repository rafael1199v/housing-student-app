using HousingApp.Application.Repositories;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Error;

namespace HousingApp.Application.Auth.UseCases;

public class GenerateRefreshTokenUseCase(IRefreshTokenRepository refreshTokenRepository) : IGenerateRefreshTokenUseCase
{
    public async Task<Result<string>> ExecuteAsync(string userId)
    {
        if (string.IsNullOrEmpty(userId))
        {
            return Result<string>.Failure(AuthError.InvalidUserId);
        }

        RefreshToken refreshToken = RefreshToken.Create(userId: userId);
        await refreshTokenRepository.SaveToken(refreshToken);
        
        return Result<string>.Success(refreshToken.Token);
    }
}
