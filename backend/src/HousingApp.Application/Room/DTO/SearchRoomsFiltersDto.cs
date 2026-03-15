namespace HousingApp.Application.Room.DTO
{
    public record SearchRoomsFiltersDto(
        string? Name,
        double? MinPrice,
        double? MaxPrice
    );
}