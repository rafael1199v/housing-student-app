namespace HousingApp.Application.Room.DTO
{
    public record RoomHouseholderDto(
        int Id,
        string Name,
        double Latitude,
        double Longitude,
        string Description,
        double Price,
        string RoomStatus,
        int BookingRequests,
        List<string> ImageRoomUrls
    );
}