using HousingApp.Application.Chat.DTOs;

namespace HousingApp.Application.Chat.UseCases;

public interface IGetUserChatsUseCase
{
    Task<Result<List<ChatSummaryDto>>> ExecuteAsync(string userId);
}
