namespace HousingApp.Application.Room.DTO
{
    public record RoomHouseholderDetailDto(
        int Id,
        string Name,
        double Latitude,
        double Longitude,
        string Description,
        decimal Price,
        string RoomStatus,
        List<string> ImageRoomUrls,
        List<BookingDto> Bookings
    );
}