using HousingApp.Domain.Enums;

namespace HousingApp.Domain.Entities;

public class Room
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required double Latitude { get; init; }
    public required double Longitude { get; init; }
    public required string Description { get; init; }
    public required double Price { get; init; }
    public required string PersonId { get; init; }
    public required RoomStatus RoomStatus { get; init; }

    public List<string> ImageUrls { get; init; } = [];
    public Person? Person { get; init; }
    public List<Policy> Policies { get; init; } = [];
    public List<int> Services { get; init; } = [];
    public List<string> ServiceCodes { get; init; } = [];

    public static Room Create(
        string name,
        double latitude,
        double longitude,
        string description,
        double price,
        string personId,
        List<Policy> policies,
        List<int> services,
        int roomStatusId
    )
    {
        return new Room
        {
            Id = 0,
            Name = name.Trim(),
            Description = description.Trim(),
            Latitude = latitude,
            Longitude = longitude,
            Price = price,
            PersonId = personId,
            RoomStatus = (RoomStatus)roomStatusId,
            Policies = policies,
            Services = services,
        };
    }
}
