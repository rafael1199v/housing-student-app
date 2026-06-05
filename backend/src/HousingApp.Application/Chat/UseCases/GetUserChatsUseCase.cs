using HousingApp.Application.Chat.DTOs;
using HousingApp.Application.Repositories;

namespace HousingApp.Application.Chat.UseCases;

public class GetUserChatsUseCase(IChatRepository chatRepository) : IGetUserChatsUseCase
{
    public async Task<Result<List<ChatSummaryDto>>> ExecuteAsync(string userId)
    {
        List<ChatSummaryDto> chats = await chatRepository.GetUserChatsAsync(userId);
        return Result<List<ChatSummaryDto>>.Success(chats);
    }
}
