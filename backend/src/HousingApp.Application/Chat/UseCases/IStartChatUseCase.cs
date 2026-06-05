using HousingApp.Application.Chat.DTOs;

namespace HousingApp.Application.Chat.UseCases;

public interface IStartChatUseCase
{
    // callerId starts (or reuses) a direct chat with another person.
    // The recipient is resolved from otherUserId when provided; otherwise roomId is used only to
    // look up that room's owner. The resulting chat is person-to-person and stores no room.
    Task<Result<ChatDto>> ExecuteAsync(string callerId, int? roomId, string? otherUserId);
}
