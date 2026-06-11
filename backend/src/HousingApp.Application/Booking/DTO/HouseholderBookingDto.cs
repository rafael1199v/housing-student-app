using HousingApp.Domain.Enums;

namespace HousingApp.Application.Booking.DTO;

public record HouseholderBookingDto(
    int Id,
    string BookerId,
    string BookerName,
    int RoomId,
    string RoomName,
    BookingStatus Status
);
