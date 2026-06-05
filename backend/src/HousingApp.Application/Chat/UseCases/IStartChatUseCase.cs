using HousingApp.Application.Chat.DTOs;

namespace HousingApp.Application.Chat.UseCases;

public interface IStartChatUseCase
{
    // callerId starts (or reuses) a chat about roomId.
    // otherUserId is required only when the caller is the room owner (a householder messaging a specific student).
    Task<Result<ChatDto>> ExecuteAsync(string callerId, int roomId, string? otherUserId);
}
