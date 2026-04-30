using HousingApp.Application.Repositories;
using HousingApp.Domain.Entities;
using HousingApp.Infrastructure.Persistence.Context;
using HousingApp.Infrastructure.Persistence.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HousingApp.Infrastructure.Persistence.Repositories;

public class RefreshTokenRepository(HousingApplicationDbContext context, UserManager<IdentityUser> userManager) : IRefreshTokenRepository
{
    public async Task SaveToken(RefreshToken token)
    {
        RefreshTokenModel refreshTokenModel = ToModel(token);

        await context.RefreshTokens.AddAsync(refreshTokenModel);
        await context.SaveChangesAsync();
    }

    public async Task<RefreshToken?> FindRefreshToken(string refreshToken)
    {
        RefreshTokenModel? refreshTokenModel = await context.RefreshTokens
            .AsNoTracking()
            .Include(r => r.User)
            .Where(r => r.Token == refreshToken)
            .FirstOrDefaultAsync();

        if (refreshTokenModel == null)
            return null;

        List<string> roles = [.. await userManager.GetRolesAsync(refreshTokenModel.User)];

        return new RefreshToken
        {
            Id = refreshTokenModel.Id,
            Token = refreshTokenModel.Token,
            ExpirationOnUtc = refreshTokenModel.ExpirationOnUtc,
            UserId = refreshTokenModel.UserId,
            IsRevoked = refreshTokenModel.IsRevoked,
            User = User.CreateUser(
                uuid: refreshTokenModel.UserId,
                email: refreshTokenModel.User.Email!,
                password: refreshTokenModel.User.PasswordHash!,
                roles: roles,
                isEmailConfirmed: refreshTokenModel.User.EmailConfirmed
            )
        };
    }

    public async Task UpdateRefreshToken(RefreshToken refreshToken)
    {
        RefreshTokenModel? refreshTokenModel = await context.RefreshTokens.FindAsync(refreshToken.Id);

        if (refreshTokenModel == null)
            return;

        refreshTokenModel.Token = refreshToken.Token;
        refreshTokenModel.ExpirationOnUtc = refreshToken.ExpirationOnUtc;

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

    public async Task RevokeRefreshTokens(string userId)
    {
        if(string.IsNullOrWhiteSpace(userId))
            throw new Exception("The userId is required");

        await context.RefreshTokens
            .Where(rt => rt.UserId == userId)
            .ExecuteDeleteAsync();
    }
}
