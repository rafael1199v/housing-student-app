using HousingApp.Domain.Enums;

namespace HousingApp.Domain.Entities;

public class Booking
{
    public required int Id { get; init; }
    public required string BookerId { get; init; }
    public required int RoomId { get; init; }
    public required BookingStatus BookingStatus { get; init; }

    public Person? Booker { get; init; }
}
