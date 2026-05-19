namespace HousingApp.Application.Room.DTOs;

public record SearchRoomsFiltersDto(
    string? Name,
    double? MinPrice,
    double? MaxPrice
);
