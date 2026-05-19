using HousingApp.Application.Repositories;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Enums;
using HousingApp.Infrastructure.Persistence.Context;
using HousingApp.Infrastructure.Persistence.Models;
using Microsoft.EntityFrameworkCore;

namespace HousingApp.Infrastructure.Persistence.Repositories;

public class RoomRepository(HousingApplicationDbContext context) : IRoomRepository
{
    public async Task<int> CreateRoomAsync(Room room)
    {
        RoomModel roomModel = ToModel(room);

        List<PolicyModel> policyModels = await context.Policies
            .Where(policyModel => room.Policies.Select(policy => policy.Id).Contains(policyModel.Id) && !policyModel.IsDeleted)
            .ToListAsync();

        List<ServiceModel> serviceModels = await context.Services
            .Where(serviceModel => room.Services.Contains(serviceModel.Id) && !serviceModel.IsDeleted)
            .ToListAsync();

        if (policyModels.Count != room.Policies.Count)
        {
            throw new Exception("Some required policies do not exist");
        }

        if (serviceModels.Count != room.Services.Count)
        {
            throw new Exception("Some required services do not exist");
        }

        roomModel.Services = serviceModels;
        roomModel.Policies = policyModels;

        await context.Rooms.AddAsync(roomModel);

        Dictionary<int, string> policyDescriptions = room.Policies
            .GroupBy(policy => policy.Id)
            .ToDictionary(group => group.Key, group => group.First().Description);

        List<RoomServiceModel> roomServices =
            [.. serviceModels.Select(service => new RoomServiceModel
            {
                Room = roomModel,
                ServiceId = service.Id
            })];

        List<RoomPolicyModel> roomPolicies =
            [.. policyModels.Select(policy => new RoomPolicyModel
            {
                Room = roomModel,
                PolicyId = policy.Id,
                Description = policyDescriptions.TryGetValue(policy.Id, out string? description)
                    ? description
                    : string.Empty
            })];

        if (roomServices.Count > 0)
        {
            await context.RoomServices.AddRangeAsync(roomServices);
        }

        if (roomPolicies.Count > 0)
        {
            await context.RoomPolicies.AddRangeAsync(roomPolicies);
        }

        List<RoomImagesModel> roomImages =
            [.. room.ImageUrls.Select(image => new RoomImagesModel { ImageUrl = image, Room = roomModel })];

        await context.RoomImages.AddRangeAsync(roomImages);

        await context.SaveChangesAsync();

        return roomModel.Id;
    }

    public async Task<List<Room>> GetRoomsAsync(RoomSearchFilters filters, int quantity = 3)
    {
        IQueryable<RoomModel> query = context.Rooms
            .AsNoTracking()
            .Where(r => !r.IsDeleted)
            .Where(r => r.RoomStatusId == (int)RoomStatus.Available);

        if (!string.IsNullOrWhiteSpace(filters.Name))
        {
            string name = filters.Name.Trim();
            query = query.Where(r => EF.Functions.ILike(r.Name, $"%{name}%"));
        }

        if (filters.MinPrice.HasValue)
        {
            query = query.Where(r => r.Price >= (decimal)filters.MinPrice.Value);
        }

        if (filters.MaxPrice.HasValue)
        {
            query = query.Where(r => r.Price <= (decimal)filters.MaxPrice.Value);
        }

        List<Room> rooms = await query
            .OrderByDescending(r => r.CreatedAt)
            .Take(quantity)
            .Select(model => new Room
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
                    Gender = model.Person.Gender,
                    ImageUrl = model.Person.ImageUrl,
                    BirthDate = model.Person.BirthDate
                },
                ImageUrls = model.RoomImages.Select(ri => ri.ImageUrl).ToList()
            })
            .ToListAsync();

        return rooms;
    }

    public async Task<Room?> GetRoomByIdAsync(int roomId)
    {
        Room? roomEntity = await context.Rooms
            .AsNoTracking()
            .Where(r => r.Id == roomId && !r.IsDeleted)
            .Select(model => new Room
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
                    Gender = model.Person.Gender,
                    ImageUrl = model.Person.ImageUrl,
                    BirthDate = model.Person.BirthDate
                },
                ImageUrls = model.RoomImages.Select(ri => ri.ImageUrl).ToList(),
                ServiceCodes = context.RoomServices
                    .Where(roomService => roomService.RoomId == model.Id && !roomService.IsDeleted)
                    .Where(roomService => !roomService.Service.IsDeleted)
                    .Select(roomService => roomService.Service.Code)
                    .ToList(),
                Policies = context.RoomPolicies
                    .Where(roomPolicy => roomPolicy.RoomId == model.Id && !roomPolicy.IsDeleted)
                    .Where(roomPolicy => !roomPolicy.Policy.IsDeleted)
                    .Select(roomPolicy => new Policy
                    {
                        Id = roomPolicy.PolicyId,
                        Code = roomPolicy.Policy.Code,
                        Description = roomPolicy.Description
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync();

        return roomEntity;
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
        {
            return false;
        }

        return true;
    }

    public async Task AddImagesAsync(int roomId, List<string> imageKeys)
    {
        List<RoomImagesModel> roomImagesModels =
            [.. imageKeys.Select(key => new RoomImagesModel { ImageUrl = key, RoomId = roomId })];

        await context.RoomImages.AddRangeAsync(roomImagesModels);
    }

    public async Task<List<RoomHouseholder>> GetHouseholderRoomsAsync(string userId)
    {
        List<RoomHouseholder> householderRooms = await context.Rooms
            .AsNoTracking()
            .Where(r => r.PersonId == userId && !r.IsDeleted)
            .Select(model => new RoomHouseholder
            {
                Id = model.Id,
                Name = model.Name,
                Latitude = model.Latitude,
                Longitude = model.Longitude,
                Description = model.Description,
                Price = (double)model.Price,
                Status = (RoomStatus)model.RoomStatusId,
                BookingRequests = model.Bookings.Count(b => !b.IsDeleted),
                ImageRoomUrls = model.RoomImages.Select(ri => ri.ImageUrl).ToList()
            })
            .ToListAsync();

        return householderRooms;
    }

    public async Task<RoomHouseholderDetail?> GetHouseholderRoomsDetailsAsync(string householderId, int roomId)
    {
        RoomHouseholderDetail? room = await context.Rooms
            .Where(r => r.Id == roomId && !r.IsDeleted && r.PersonId == householderId)
            .Select(model => new RoomHouseholderDetail
            {
                Id = model.Id,
                Name = model.Name,
                Latitude = model.Latitude,
                Longitude = model.Longitude,
                Description = model.Description,
                Price = (double)model.Price,
                Status = (RoomStatus)model.RoomStatusId,
                ImageRoomUrls = model.RoomImages.Select(ri => ri.ImageUrl).ToList(),
                ServiceCodes = context.RoomServices
                    .Where(roomService => roomService.RoomId == model.Id && !roomService.IsDeleted)
                    .Where(roomService => !roomService.Service.IsDeleted)
                    .Select(roomService => roomService.Service.Code)
                    .ToList(),
                Policies = context.RoomPolicies
                    .Where(roomPolicy => roomPolicy.RoomId == model.Id && !roomPolicy.IsDeleted)
                    .Where(roomPolicy => !roomPolicy.Policy.IsDeleted)
                    .Select(roomPolicy => new Policy
                    {
                        Id = roomPolicy.PolicyId,
                        Code = roomPolicy.Policy.Code,
                        Description = roomPolicy.Description
                    })
                    .ToList(),
                Bookings = model.Bookings.Where(b => !b.IsDeleted).Select(b => new Booking
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
                        Gender = b.Booker.Gender,
                        ImageUrl = b.Booker.ImageUrl,
                        BirthDate = b.Booker.BirthDate
                    }
                }).ToList()
            })
            .FirstOrDefaultAsync();

        return room;
    }

    private static RoomModel ToModel(Room room)
    {
        return new RoomModel
        {
            Name = room.Name,
            Latitude = room.Latitude,
            Longitude = room.Longitude,
            Description = room.Description,
            Price = (decimal)room.Price,
            PersonId = room.PersonId,
            RoomStatusId = (int)room.RoomStatus,
            Policies = [],
            Services = [],
        };
    }
}
