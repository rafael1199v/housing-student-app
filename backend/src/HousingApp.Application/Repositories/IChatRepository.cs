using HousingApp.Application.Chat.DTOs;

namespace HousingApp.Application.Repositories;

public interface IChatRepository
{
    Task<string?> GetRoomOwnerIdAsync(int roomId);

    Task<int?> FindDirectChatIdAsync(string directKey);

    Task<int> CreateChatAsync(Domain.Entities.Chat chat, IEnumerable<string> participantIds);

    Task<bool> IsParticipantAsync(int chatId, string userId);

    Task<MessageDto> AddMessageAsync(Domain.Entities.ChatMessage message);

    Task<List<int>> GetChatIdsForUserAsync(string userId);

    Task<List<MessageDto>> GetMessagesAsync(int chatId, int? beforeMessageId, int pageSize);

    Task<List<ChatSummaryDto>> GetUserChatsAsync(string userId);

    Task<bool> MarkAsReadAsync(int chatId, string userId, int lastMessageId);
}
