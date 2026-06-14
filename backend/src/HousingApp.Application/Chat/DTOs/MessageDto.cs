namespace HousingApp.Application.Chat.DTOs;

public record MessageDto(
    int Id,
    int ChatId,
    string SenderId,
    string SenderName,
    string Message,
    DateTime CreatedAt
);
