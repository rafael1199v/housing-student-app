using HousingApp.Domain.Entities;

namespace HousingApp.Application.Repositories;

public interface IUserRepository
{
    Task<Result<Domain.Entities.User>> GetByIdAsync(string userId);
    Task<Result<Person>> GetFullUserByIdAsync(string userId);
    Task<string> RegisterUser(Domain.Entities.User newUser, Domain.Enums.Roles role);

    Task<Domain.Entities.User?> FindUserByEmailAsync(string email);

    Task<bool> CheckPassword(string email, string password);
}
