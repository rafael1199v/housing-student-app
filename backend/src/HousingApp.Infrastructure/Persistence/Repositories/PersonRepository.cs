using HousingApp.Application.Repositories;
using HousingApp.Domain.Entities;
using HousingApp.Infrastructure.Persistence.Context;
using HousingApp.Infrastructure.Persistence.Models;
using Microsoft.EntityFrameworkCore;

namespace HousingApp.Infrastructure.Persistence.Repositories;

public class PersonRepository(HousingApplicationDbContext context) : IPersonRepository
{
    public async Task CreatePerson(Person person)
    {
        PersonModel model = ToModel(person);
        await context.Persons.AddAsync(model);
    }

    public async Task<bool> ExistsByUserIdAsync(string userId)
    {
        return await context.Persons
            .AsNoTracking()
            .AnyAsync(person => person.UserId == userId && !person.IsDeleted);
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
            ImageUrl = string.IsNullOrEmpty(person.ImageUrl) ? null : person.ImageUrl
        };
    }
}
