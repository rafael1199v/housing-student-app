namespace HousingApp.Application.Room.DTO
{
    public record CreateRoomDto(
        string Name,
        string Description,
        double Latitude,
        double Longitude,
        double Price,
        int RoomStatusId,
        List<string> Images
    );
}