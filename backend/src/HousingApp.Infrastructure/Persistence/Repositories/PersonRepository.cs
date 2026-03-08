using HousingApp.Domain.Entities;
using HousingApp.Domain.Repositories;
using HousingApp.Infrastructure.Persistence.Context;
using HousingApp.Infrastructure.Persistence.Models;

namespace HousingApp.Infrastructure.Persistence.Repositories
{
    public class PersonRepository(HousingApplicationDbContext context): IPersonRepository
    {
        public async Task CreatePerson(Person person)
        {
            PersonModel model = ToModel(person);
            await context.Persons.AddAsync(model);
        }
        
        private static PersonModel ToModel(Person person)
        {
            return new PersonModel
            {
                UserId = person.Id,
                FirstName = person.FirstName,
                LastName = person.LastName,
                Email = person.Email,
                PhoneNumber = person.PhoneNumber,
                BirthDate = person.BirthDate,
                Nationality = person.Nationality,
                Age = person.Age,
                Gender = person.Gender,
                ImageUrl = person.ImageUrl,
            };
        }
    }
}