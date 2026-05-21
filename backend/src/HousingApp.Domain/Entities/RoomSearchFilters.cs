namespace HousingApp.Domain.Entities;

public record RoomSearchFilters(
    string? Name,
    double? MinPrice,
    double? MaxPrice,
    int[]? Services
);
