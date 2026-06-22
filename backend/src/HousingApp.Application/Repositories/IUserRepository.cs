using HousingApp.Domain.Entities;

namespace HousingApp.Application.Repositories;

public interface IUserRepository
{
    Task<Domain.Entities.User> GetByIdAsync(string userId);
    Task<Person> GetFullUserByIdAsync(string userId);
    Task<string> RegisterUser(Domain.Entities.User newUser, Domain.Enums.Roles role);

    Task<Domain.Entities.User?> FindUserByEmailAsync(string email);

    Task<bool> CheckPassword(string email, string password);

    Task<Domain.Entities.User?> GetUserByIdAsync(string userId);

    Task<bool> AddRoleToUserAsync(string userId, string role);

    Task<string> RegisterExternalUser(Domain.Entities.User newUser, Domain.Enums.Roles role);

    Task<string> GenerateEmailConfirmationToken(string userId);

    Task<bool> ConfirmEmail(string userId, string token);
}
