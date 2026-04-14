using HousingApp.Domain.Entities;

namespace HousingApp.Application.Repositories;

public interface IRefreshTokenRepository
{
    Task SaveToken(RefreshToken token);
}
