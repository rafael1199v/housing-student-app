namespace HousingApp.Application.Room.DTO;

public record BookingDto(
    int Id,
    string BookerId,
    string BookerName,
    string BookerEmail,
    string BookerPhoneNumber,
    string BookingStatus,
    int RoomId
);
