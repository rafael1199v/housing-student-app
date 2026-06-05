using HousingApp.Application.Repositories;
using HousingApp.Domain.Error;

namespace HousingApp.Application.Chat.UseCases;

public class MarkChatReadUseCase(IChatRepository chatRepository) : IMarkChatReadUseCase
{
    public async Task<Result<bool>> ExecuteAsync(string callerId, int chatId, int lastMessageId)
    {
        if (!await chatRepository.IsParticipantAsync(chatId, callerId))
        {
            return Result<bool>.Failure(ChatError.NotAParticipant);
        }

        bool updated = await chatRepository.MarkAsReadAsync(chatId, callerId, lastMessageId);
        return Result<bool>.Success(updated);
    }
}
