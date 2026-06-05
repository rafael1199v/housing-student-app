namespace HousingApp.Domain.Entities;

public class Chat
{
    public required int Id { get; init; }
    public int? RoomId { get; init; }
}
