using HousingApp.Application.Repositories;
using HousingApp.Domain.Entities;
using HousingApp.Infrastructure.Persistence.Context;
using HousingApp.Infrastructure.Persistence.Models;

namespace HousingApp.Infrastructure.Persistence.Repositories;

public class RefreshTokenRepository(HousingApplicationDbContext context) : IRefreshTokenRepository
{
    public async Task SaveToken(RefreshToken token)
    {
        RefreshTokenModel refreshTokenModel = ToModel(token);
        
        await context.RefreshTokens.AddAsync(refreshTokenModel);
        await context.SaveChangesAsync();
    }

    private static RefreshTokenModel ToModel(RefreshToken refreshToken)
    {
        return new RefreshTokenModel
        {
            Id = refreshToken.Id,
            Token = refreshToken.Token,
            ExpirationOnUtc = refreshToken.ExpirationOnUtc,
            UserId = refreshToken.UserId,
            IsRevoked = refreshToken.IsRevoked,
            CreatedAt = DateTime.UtcNow
        };
    }

}
