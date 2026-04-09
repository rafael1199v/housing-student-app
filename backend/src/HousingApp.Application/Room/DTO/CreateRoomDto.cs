using HousingApp.Application.Room.Upload;

namespace HousingApp.Application.Room.DTO;

public record CreateRoomDto(
    string Name,
    string Description,
    double Latitude,
    double Longitude,
    double Price,
    int RoomStatusId,
    List<ImageRoomUpload> Images
);
