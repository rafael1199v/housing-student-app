using HousingApp.Application.Chat.DTOs;

namespace HousingApp.Application.Chat.UseCases;

public interface ISendMessageUseCase
{
    Task<Result<MessageDto>> ExecuteAsync(string senderId, int chatId, string message);
}
