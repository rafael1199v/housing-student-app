using System;

namespace HousingApp.Api.Requests;

public class CreateRoomRequest
{
    public required string Name { get; set;}
    public required string Description { get; set;}
    public required double Latitude { get; set;}
    public required double Longitude { get; set;}
    public required double Price { get; set;}
    public required int RoomStatusId { get; set;}
    public List<IFormFile> Images { get; set;} = [];
}
