using HousingApp.Application.Chat.DTOs;
using HousingApp.Application.Repositories;
using HousingApp.Domain.Error;

namespace HousingApp.Application.Chat.UseCases;

public class GetChatMessagesUseCase(IChatRepository chatRepository) : IGetChatMessagesUseCase
{
    private const int DefaultPageSize = 30;
    private const int MaxPageSize = 100;

    public async Task<Result<List<MessageDto>>> ExecuteAsync(string callerId, int chatId, int? beforeMessageId,
        int pageSize)
    {
        if (!await chatRepository.IsParticipantAsync(chatId, callerId))
        {
            return Result<List<MessageDto>>.Failure(ChatError.NotAParticipant);
        }

        int size = pageSize <= 0 ? DefaultPageSize : Math.Min(pageSize, MaxPageSize);

        List<MessageDto> messages = await chatRepository.GetMessagesAsync(chatId, beforeMessageId, size);
        return Result<List<MessageDto>>.Success(messages);
    }
}
