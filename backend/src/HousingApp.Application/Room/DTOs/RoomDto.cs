namespace HousingApp.Application.Room.DTOs;

public record RoomDto(
    int Id,
    string Name,
    double Latitude,
    double Longitude,
    string Description,
    double Price,
    string PersonId,
    string RoomStatus,
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    string Nationality,
    string Gender,
    string ImageUrl,
    List<string> ImageRoomUrls
);
