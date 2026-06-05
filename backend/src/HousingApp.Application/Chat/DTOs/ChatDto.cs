namespace HousingApp.Application.Chat.DTOs;

public record ChatDto(
    int ChatId,
    IReadOnlyList<string> ParticipantIds
);
