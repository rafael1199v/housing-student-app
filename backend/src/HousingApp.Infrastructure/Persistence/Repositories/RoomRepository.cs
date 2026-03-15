using HousingApp.Domain.Entities;
using HousingApp.Domain.Enums;
using HousingApp.Domain.Repositories;
using HousingApp.Infrastructure.Persistence.Context;
using HousingApp.Infrastructure.Persistence.Models;
using Microsoft.EntityFrameworkCore;

namespace HousingApp.Infrastructure.Persistence.Repositories
{
    public class RoomRepository(HousingApplicationDbContext context) : IRoomRepository
    {
        public async Task<List<Room>> GetRoomsAsync(RoomSearchFilters filters, int quantity = 3)
        {
            IQueryable<RoomModel> query = context.Rooms
                .AsNoTracking()
                .Include(r =>r.Person)
                .Include(r => r.RoomStatus)
                .Include(r => r.RoomImages)
                .Where(r => !r.IsDeleted)
                .Where(r => r.RoomStatusId == (int)RoomStatus.Available);

            if (!string.IsNullOrWhiteSpace(filters.Name))
            {
                string name = filters.Name.Trim();
                query = query.Where(r => EF.Functions.ILike(r.Name, $"%{name}%"));
            }

            if (filters.MinPrice.HasValue)
                query = query.Where(r => r.Price >= (decimal)filters.MinPrice.Value);

            if (filters.MaxPrice.HasValue)
                query = query.Where(r => r.Price <= (decimal)filters.MaxPrice.Value);

            List<RoomModel> rooms = await query
                .OrderByDescending(r => r.CreatedAt)
                .Take(quantity)
                .ToListAsync();

            return [.. rooms.Select(ToDomain)];
        }

        private static Room ToDomain(RoomModel model)
        {
            return new Room
            {
                Id = model.Id,
                Name = model.Name,
                Latitude = model.Latitude,
                Longitude = model.Longitude,
                Description = model.Description,
                Price = (double)model.Price,
                PersonId = model.PersonId,
                RoomStatus = (RoomStatus)model.RoomStatusId,
                Person = new Person
                {
                    Id = model.PersonId,
                    FirstName = model.Person.FirstName,
                    LastName = model.Person.LastName,
                    Email = model.Person.Email,
                    PhoneNumber = model.Person.PhoneNumber,
                    Nationality = model.Person.Nationality,
                    Age = model.Person.Age,
                    Gender = model.Person.Gender,
                    ImageUrl = model.Person.ImageUrl,
                    BirthDate = model.Person.BirthDate
                },
                ImageUrls = [.. model.RoomImages.Select(ri => ri.ImageUrl)]
            };
        }
    }
}