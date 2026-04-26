using HousingApp.Domain.Entities;

namespace HousingApp.Application.Repositories;

public interface IUserRepository
{
    Task<string> RegisterUser(User newUser, Domain.Enums.Roles role);

    Task<User?> FindUserByEmailAsync(string email);

    Task<bool> CheckPassword(string email, string password);

    Task<User?> GetUserByIdAsync(string userId);

    Task<string> RegisterExternalUser(User newUser, Domain.Enums.Roles role);

    Task<string> GenerateEmailConfirmationLink(User user);

    Task<bool> ConfirmEmail(string userId, string token);
}
