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
        public async Task CreateRoomAsync(Room room)
        {
            RoomModel roomModel = new()
            {
                Name = room.Name,
                Latitude = room.Latitude,
                Longitude = room.Longitude,
                Description = room.Description,
                Price = (decimal)room.Price,
                PersonId = room.PersonId,
                RoomStatusId = (int)room.RoomStatus,
            };

            await context.Rooms.AddAsync(roomModel);

            if (room.ImageUrls.Count == 0)
                return;

            List<RoomImagesModel> roomImages =
                [.. room.ImageUrls.Select(image => new RoomImagesModel { ImageUrl = image, Room = roomModel })];

            await context.RoomImages.AddRangeAsync(roomImages);
        }

        public async Task<List<Room>> GetRoomsAsync(RoomSearchFilters filters, int quantity = 3)
        {
            IQueryable<RoomModel> query = context.Rooms
                .AsNoTracking()
                .Include(r => r.Person)
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

        public async Task<Room?> GetRoomByIdAsync(int roomId)
        {
            RoomModel? roomModel = await context.Rooms
                .Include(r => r.Person)
                .FirstOrDefaultAsync(r => r.Id == roomId && !r.IsDeleted);

            return roomModel is null ? null : ToDomain(roomModel);
        }

        public async Task<bool> TryMarkAsBookedAsync(int roomId)
        {
            int affectedRows = await context.Rooms
                .Where(room => room.Id == roomId && !room.IsDeleted)
                .Where(room => room.RoomStatusId == (int)RoomStatus.Available)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(room => room.RoomStatusId, (int)RoomStatus.Booked)
                    .SetProperty(room => room.UpdatedAt, DateTime.UtcNow));

            return affectedRows == 1;
        }

        public async Task<bool> IsRoomAvailable(int roomId)
        {
            RoomModel? room = await context.Rooms.FirstOrDefaultAsync(r => r.Id == roomId && !r.IsDeleted);

            if (room is null || room.RoomStatusId != (int)RoomStatus.Available)
                return false;

            return true;
        }

        public async Task<List<RoomHouseholder>> GetHouseholderRoomsAsync(string userId)
        {
            List<RoomModel> householderRooms = await context.Rooms
                .Include(r => r.Bookings)
                .Include(r => r.RoomImages)
                .Where(r => r.PersonId == userId && !r.IsDeleted).ToListAsync();
            return [.. householderRooms.Select(ToHouseholderDomain)];
        }

        public async Task<RoomHouseholderDetail?> GetHouseholderRoomsDetailsAsync(string householderId, int roomId)
        {
            RoomModel? room = await context.Rooms
                .Include(r => r.Bookings)
                .ThenInclude(b => b.Booker)
                .Include(r => r.RoomImages)
                .Where(r => r.Id == roomId && !r.IsDeleted && r.PersonId == householderId)
                .FirstOrDefaultAsync();

            return room is null ? null : ToRoomHouseholderDetail(room);
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

        private static RoomHouseholder ToHouseholderDomain(RoomModel model)
        {
            return new RoomHouseholder
            {
                Id = model.Id,
                Name = model.Name,
                Latitude = model.Latitude,
                Longitude = model.Longitude,
                Description = model.Description,
                Price = (double)model.Price,
                Status = (RoomStatus)model.RoomStatusId,
                BookingRequests = model.Bookings.Count(b => !b.IsDeleted),
                ImageRoomUrls = [.. model.RoomImages.Select(ri => ri.ImageUrl)]
            };
        }

        private static RoomHouseholderDetail? ToRoomHouseholderDetail(RoomModel model)
        {
            return new RoomHouseholderDetail
            {
                Id = model.Id,
                Name = model.Name,
                Latitude = model.Latitude,
                Longitude = model.Longitude,
                Description = model.Description,
                Price = (double)model.Price,
                Status = (RoomStatus)model.RoomStatusId,
                ImageRoomUrls = [.. model.RoomImages.Select(ri => ri.ImageUrl)],
                Bookings = [..model.Bookings.Select(b => new Booking
                {
                    Id = b.Id,
                    BookerId = b.BookerId,
                    RoomId = b.RoomId,
                    BookingStatus = (BookingStatus)b.BookingStatusId,
                    Booker = new Person
                    {
                        Id = b.BookerId,
                        FirstName = b.Booker.FirstName,
                        LastName = b.Booker.LastName,
                        Email = b.Booker.Email,
                        PhoneNumber = b.Booker.PhoneNumber,
                        Nationality = b.Booker.Nationality,
                        Age = b.Booker.Age,
                        Gender = b.Booker.Gender,
                        ImageUrl = b.Booker.ImageUrl,
                        BirthDate = b.Booker.BirthDate
                    }

                })]
            };
        }
    }
}