using HousingApp.Application.Chat.DTOs;
using HousingApp.Application.Repositories;
using HousingApp.Application.Storage;

namespace HousingApp.Application.Chat.UseCases;

public class GetUserChatsUseCase(IChatRepository chatRepository, IStorageService storageService)
    : IGetUserChatsUseCase
{
    public async Task<Result<List<ChatSummaryDto>>> ExecuteAsync(string userId)
    {
        List<ChatSummaryDto> chats = await chatRepository.GetUserChatsAsync(userId);

        List<ChatSummaryDto> presigned =
        [
            .. chats.Select(c => c with
            {
                OtherParticipantImageUrl = string.IsNullOrEmpty(c.OtherParticipantImageUrl)
                    ? ""
                    : storageService.GeneratePresignedDownloadUrl(c.OtherParticipantImageUrl)
            })
        ];

        return Result<List<ChatSummaryDto>>.Success(presigned);
    }
}
