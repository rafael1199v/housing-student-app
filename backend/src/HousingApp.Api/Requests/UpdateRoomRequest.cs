using HousingApp.Application.Room.DTOs;

namespace HousingApp.Api.Requests;

public class UpdateRoomRequest
{
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required double Latitude { get; set; }
    public required double Longitude { get; set; }
    public required double Price { get; set; }
    public required int RoomStatusId { get; set; }
    public List<IFormFile> Images { get; set; } = [];
    public List<int> KeptImageIds { get; set; } = [];
    public List<CreateRoomServiceDto> Services { get; set; } = [];
    public List<CreateRoomPolicyDto> Policies { get; set; } = [];
}
