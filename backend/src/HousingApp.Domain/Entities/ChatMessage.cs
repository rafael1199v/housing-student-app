namespace HousingApp.Domain.Entities;

public class ChatMessage
{
    public required int Id { get; init; }
    public required int ChatId { get; init; }
    public required string SenderId { get; init; }
    public required string Message { get; init; }
    public DateTime CreatedAt { get; init; }
}
