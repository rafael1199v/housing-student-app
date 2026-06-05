using HousingApp.Application;
using HousingApp.Application.Chat.DTOs;
using HousingApp.Application.Chat.UseCases;
using HousingApp.Domain.Error;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.JsonWebTokens;

namespace HousingApp.Api.Hubs;

[Authorize]
public class ChatHub(
    ISendMessageUseCase sendMessageUseCase,
    IGetUserChatIdsUseCase getUserChatIdsUseCase) : Hub
{
    private const string ReceiveMessage = "ReceiveMessage";
    private const string ErrorEvent = "Error";

    public override async Task OnConnectedAsync()
    {
        string? userId = GetUserId();

        if (!string.IsNullOrWhiteSpace(userId))
        {
            Result<List<int>> chatIds = await getUserChatIdsUseCase.ExecuteAsync(userId);

            if (chatIds.IsSuccess && chatIds.Value is not null)
            {
                foreach (int chatId in chatIds.Value)
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, GroupName(chatId));
                }
            }
        }

        await base.OnConnectedAsync();
    }

    public async Task SendMessage(int chatId, string message)
    {
        string? userId = GetUserId();

        if (string.IsNullOrWhiteSpace(userId))
        {
            await Clients.Caller.SendAsync(ErrorEvent, "Unauthorized");
            return;
        }

        Result<MessageDto> result = await sendMessageUseCase.ExecuteAsync(userId, chatId, message);

        if (!result.IsSuccess)
        {
            await Clients.Caller.SendAsync(ErrorEvent, result.Error);
            return;
        }

        await Clients.Group(GroupName(chatId)).SendAsync(ReceiveMessage, result.Value);
    }

    public async Task JoinChat(int chatId)
    {
        string? userId = GetUserId();

        if (string.IsNullOrWhiteSpace(userId))
        {
            await Clients.Caller.SendAsync(ErrorEvent, "Unauthorized");
            return;
        }

        Result<List<int>> chatIds = await getUserChatIdsUseCase.ExecuteAsync(userId);

        if (chatIds.IsSuccess && chatIds.Value is not null && chatIds.Value.Contains(chatId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, GroupName(chatId));
        }
        else
        {
            await Clients.Caller.SendAsync(ErrorEvent, ChatError.NotAParticipant);
        }
    }

    public Task LeaveChat(int chatId)
    {
        return Groups.RemoveFromGroupAsync(Context.ConnectionId, GroupName(chatId));
    }

    private string? GetUserId()
    {
        return Context.User?.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
    }

    private static string GroupName(int chatId)
    {
        return $"chat-{chatId}";
    }
}
