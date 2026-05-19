using HousingApp.Domain.Entities;

namespace HousingApp.Application.Repositories;

public interface IRefreshTokenRepository
{
    Task SaveToken(RefreshToken token);
    Task<RefreshToken?> FindRefreshToken(string refreshToken);
    Task UpdateRefreshToken(RefreshToken refreshToken);
    Task RevokeRefreshTokens(string userId);
}
