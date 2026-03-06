using HousingApp.Domain.Entities;
using HousingApp.Domain.Enums;

namespace HousingApp.Domain.Repositories
{
    public interface IUserRepository
    {
        Task<string> RegisterUser(User newUser, Roles role);
    }
}