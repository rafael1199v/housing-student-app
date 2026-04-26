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

    public async Task<bool> UpdateUserDataAsync(
        string userId,
        string firstName,
        string lastName,
        string phoneNumber,
        string nationality,
        string gender,
        DateOnly birthDate)
    {
        int affectedRows = await context.Persons
            .Where(person => person.UserId == userId && !person.IsDeleted)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(person => person.FirstName, firstName)
                .SetProperty(person => person.LastName, lastName)
                .SetProperty(person => person.PhoneNumber, phoneNumber)
                .SetProperty(person => person.Nationality, nationality)
                .SetProperty(person => person.Gender, gender)
                .SetProperty(person => person.BirthDate, birthDate)
                .SetProperty(person => person.UpdatedAt, DateTime.UtcNow));

        return affectedRows == 1;
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
            Gender = person.Gender,
            ImageUrl = string.IsNullOrEmpty(person.ImageUrl) ? null : person.ImageUrl
        };
    }
}
