namespace HousingApp.Application.Chat.UseCases;

public interface IGetUserChatIdsUseCase
{
    // Used by the hub to know which SignalR groups a freshly connected user should join.
    Task<Result<List<int>>> ExecuteAsync(string userId);
}
