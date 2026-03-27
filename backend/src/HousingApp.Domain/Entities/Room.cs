using HousingApp.Domain.Enums;

namespace HousingApp.Domain.Entities
{
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

        public List<string> ImageUrls { get; init; } = new List<string>();
        public Person? Person { get; init; }
    }
}