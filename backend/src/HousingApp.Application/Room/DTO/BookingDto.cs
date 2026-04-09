namespace HousingApp.Application.Room.DTO;

public record BookingDto(
    int Id,
    string BookerId,
    string BookerName,
    string BookerEmail,
    string BookingStatus,
    int RoomId
);
