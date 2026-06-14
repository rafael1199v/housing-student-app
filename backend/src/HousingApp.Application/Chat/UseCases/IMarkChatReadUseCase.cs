namespace HousingApp.Application.Chat.UseCases;

public interface IMarkChatReadUseCase
{
    Task<Result<bool>> ExecuteAsync(string callerId, int chatId, int lastMessageId);
}
