namespace HousingApp.Application.Room.DTO
{
    public record CreatedRoomDto(
        string Name,
        string Description,
        double Latitude,
        double Longitude,
        double Price,
        string RoomStatus,
        List<string> ImageRoomUrls
    );
}