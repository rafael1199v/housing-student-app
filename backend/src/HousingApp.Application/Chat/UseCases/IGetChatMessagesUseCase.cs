using HousingApp.Application.Chat.DTOs;

namespace HousingApp.Application.Chat.UseCases;

public interface IGetChatMessagesUseCase
{
    Task<Result<List<MessageDto>>> ExecuteAsync(string callerId, int chatId, int? beforeMessageId, int pageSize);
}
