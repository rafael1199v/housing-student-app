namespace HousingApp.Application.Room.DTOs;

public record BookingDto(
    int Id,
    string BookerId,
    string BookerName,
    string BookerEmail,
    string BookerPhoneNumber,
    string BookingStatus,
    int RoomId
);
