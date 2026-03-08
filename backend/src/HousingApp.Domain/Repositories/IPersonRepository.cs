using HousingApp.Domain.Entities;

namespace HousingApp.Domain.Repositories
{
    public interface IPersonRepository
    {
        Task CreatePerson(Person person);
    }
}