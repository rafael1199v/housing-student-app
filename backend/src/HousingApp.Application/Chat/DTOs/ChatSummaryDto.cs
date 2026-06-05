namespace HousingApp.Application.Chat.DTOs;

public record ChatSummaryDto(
    int ChatId,
    int? RoomId,
    string? RoomName,
    string OtherParticipantId,
    string OtherParticipantName,
    string? LastMessage,
    DateTime? LastMessageAt,
    int UnreadCount
);
