using HousingApp.Application.Repositories;
using HousingApp.Domain.Error;

namespace HousingApp.Application.Auth.UseCases;

public class LogoutUseCase(IRefreshTokenRepository refreshTokenRepository) : ILogoutUseCase
{
    public async Task<Result<bool>> ExecuteAsync(string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return Result<bool>.Failure(AuthError.InvalidUserId);


        await refreshTokenRepository.RevokeRefreshTokens(userId);

        return Result<bool>.Success(true);
    }
}
