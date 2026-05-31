namespace HousingApp.Application.Room.DTOs;

public record RoomHouseholderDetailDto(
    int Id,
    string Name,
    double Latitude,
    double Longitude,
    string Description,
    decimal Price,
    string RoomStatus,
    List<string> ImageRoomUrls,
    List<RoomImageDto> Images,
    List<string> Services,
    List<RoomPolicyDto> Policies,
    List<BookingDto> Bookings
);
