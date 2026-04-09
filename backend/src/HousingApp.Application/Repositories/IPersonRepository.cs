using HousingApp.Domain.Entities;

namespace HousingApp.Application.Repositories;

public interface IPersonRepository
{
    Task CreatePerson(Person person);
    Task<bool> ExistsByUserIdAsync(string userId);
}
