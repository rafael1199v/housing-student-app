using FluentValidation;
using FluentValidation.Results;
using HousingApp.Api.Hubs;
using HousingApp.Api.Requests;
using HousingApp.Application;
using HousingApp.Application.Chat.DTOs;
using HousingApp.Application.Chat.UseCases;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;

namespace HousingApp.Api.Controllers;

[ApiController]
[Route("api/chats")]
[Authorize]
public class ChatController(
    IStartChatUseCase startChatUseCase,
    IGetUserChatsUseCase getUserChatsUseCase,
    IGetChatMessagesUseCase getChatMessagesUseCase,
    IMarkChatReadUseCase markChatReadUseCase,
    IValidator<StartChatRequest> startChatValidator,
    IHubContext<ChatHub> chatHub) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(typeof(ChatDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> StartChat([FromBody] StartChatRequest request)
    {
        ValidationResult validationResult = await startChatValidator.ValidateAsync(request);

        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.Errors);
        }

        string? userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        Result<ChatDto> result =
            await startChatUseCase.ExecuteAsync(userId, request.RoomId, request.ParticipantUserId);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Error);
        }

        ChatDto chat = result.Value!;

        foreach (string participantId in chat.ParticipantIds)
        {
            await chatHub.Clients.User(participantId).SendAsync("ChatCreated", chat);
        }

        return Ok(chat);
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<ChatSummaryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUserChats()
    {
        string? userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        Result<List<ChatSummaryDto>> result = await getUserChatsUseCase.ExecuteAsync(userId);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpGet("{chatId:int}/messages")]
    [ProducesResponseType(typeof(List<MessageDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMessages(int chatId, [FromQuery] int? beforeMessageId,
        [FromQuery] int pageSize = 30)
    {
        string? userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        Result<List<MessageDto>> result =
            await getChatMessagesUseCase.ExecuteAsync(userId, chatId, beforeMessageId, pageSize);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpPut("{chatId:int}/read")]
    [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
    public async Task<IActionResult> MarkRead(int chatId, [FromBody] MarkReadRequest request)
    {
        string? userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        Result<bool> result = await markChatReadUseCase.ExecuteAsync(userId, chatId, request.LastMessageId);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }
}
