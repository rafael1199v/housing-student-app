using HousingApp.Application.Room.Upload;

namespace HousingApp.Application.Room.DTOs;

public record UpdateRoomDto(
    int RoomId,
    string Name,
    string Description,
    double Latitude,
    double Longitude,
    double Price,
    int RoomStatusId,
    List<ImageRoomUpload> NewImages,
    List<int> KeptImageIds,
    List<CreateRoomPolicyDto> Policies,
    List<CreateRoomServiceDto> Services
);
