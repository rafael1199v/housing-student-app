using HousingApp.Application.Repositories;

namespace HousingApp.Application.Chat.UseCases;

public class GetUserChatIdsUseCase(IChatRepository chatRepository) : IGetUserChatIdsUseCase
{
    public async Task<Result<List<int>>> ExecuteAsync(string userId)
    {
        List<int> chatIds = await chatRepository.GetChatIdsForUserAsync(userId);
        return Result<List<int>>.Success(chatIds);
    }
}
