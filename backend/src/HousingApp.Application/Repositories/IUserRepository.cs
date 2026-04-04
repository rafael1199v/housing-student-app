using HousingApp.Domain.Entities;

namespace HousingApp.Application.Repositories;

public interface IUserRepository
{
    Task<string> RegisterUser(User newUser, Domain.Enums.Roles role);

    Task<User?> FindUserByEmailAsync(string email);

    Task<bool> CheckPassword(string email, string password);
}
