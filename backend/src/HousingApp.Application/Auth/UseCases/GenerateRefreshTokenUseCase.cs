using HousingApp.Application.Repositories;
using HousingApp.Domain.Entities;

namespace HousingApp.Application.Auth.UseCases;

public class GenerateRefreshTokenUseCase(IRefreshTokenRepository refreshTokenRepository) : IGenerateRefreshTokenUseCase
{
    public async Task<Result<string>> GenerateRefreshToken(string userId)
    {
        RefreshToken refreshToken = RefreshToken.Create(userId: userId);
        await refreshTokenRepository.SaveToken(refreshToken);
        
        return Result<string>.Success(refreshToken.Token);
    }
}
