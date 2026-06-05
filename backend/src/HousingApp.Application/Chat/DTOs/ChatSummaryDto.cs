namespace HousingApp.Application.Chat.DTOs;

public record ChatSummaryDto(
    int ChatId,
    string OtherParticipantId,
    string OtherParticipantName,
    string? LastMessage,
    DateTime? LastMessageAt,
    int UnreadCount
);
