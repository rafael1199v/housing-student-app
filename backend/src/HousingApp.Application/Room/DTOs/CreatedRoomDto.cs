namespace HousingApp.Application.Room.DTOs;

public record CreatedRoomDto(
    string Name,
    string Description,
    double Latitude,
    double Longitude,
    double Price,
    string RoomStatus,
    List<string> ImageRoomUrls,
    List<CreateRoomPolicyDto> Policies,
    List<CreateRoomServiceDto> Services
);
