using HousingApp.Domain.Enums;

namespace HousingApp.Domain.Entities
{
    public class RoomHouseholderDetail
    {
        public required int Id { get; init; }
        public required string Name { get; init; } = string.Empty;
        public required double Latitude { get; init; }
        public required double Longitude { get; init; }
        public required string Description { get; init; } = string.Empty;
        public required double Price { get; init; }
        public required RoomStatus Status { get; init; }
        public required List<string> ImageRoomUrls { get; init; } = [];
        public required List<Booking> Bookings { get; init; } = [];
    }
}