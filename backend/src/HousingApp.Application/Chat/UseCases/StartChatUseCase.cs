using HousingApp.Application.Chat.DTOs;
using HousingApp.Application.UnitOfWork;
using HousingApp.Domain.Enums;
using HousingApp.Domain.Error;
using Microsoft.Extensions.Logging;

namespace HousingApp.Application.Chat.UseCases;

public class StartChatUseCase(IChatUnitOfWork unitOfWork, ILogger<StartChatUseCase> logger) : IStartChatUseCase
{
    public async Task<Result<ChatDto>> ExecuteAsync(string callerId, int? roomId, string? otherUserId)
    {
        string otherParticipantId;

        if (!string.IsNullOrWhiteSpace(otherUserId))
        {
            otherParticipantId = otherUserId;
        }
        else if (roomId is not null)
        {
            // No explicit recipient: resolve the owner of the given room (student-initiated from a listing).
            string? ownerId = await unitOfWork.ChatRepository.GetRoomOwnerIdAsync(roomId.Value);

            if (ownerId is null)
            {
                return Result<ChatDto>.Failure(ChatError.RoomNotFound);
            }

            otherParticipantId = ownerId;
        }
        else
        {
            return Result<ChatDto>.Failure(ChatError.RoomOrRecipientRequired);
        }

        if (callerId == otherParticipantId)
        {
            return Result<ChatDto>.Failure(ChatError.CannotChatWithSelf);
        }

        if (!await unitOfWork.PersonRepository.ExistsByUserIdAsync(otherParticipantId))
        {
            return Result<ChatDto>.Failure(ChatError.RecipientNotFound);
        }

        string directKey = Domain.Entities.Chat.BuildDirectKey(callerId, otherParticipantId);

        int? existingChatId = await unitOfWork.ChatRepository.FindDirectChatIdAsync(directKey);

        if (existingChatId is not null)
        {
            return Result<ChatDto>.Success(new ChatDto(existingChatId.Value, [callerId, otherParticipantId]));
        }

        await unitOfWork.BeginTransactionAsync();

        try
        {
            int chatId = await unitOfWork.ChatRepository.CreateChatAsync(
                new Domain.Entities.Chat { Id = 0, ChatType = ChatType.Direct, DirectKey = directKey },
                [callerId, otherParticipantId]);

            await unitOfWork.CommitTransactionAsync();

            logger.LogInformation(
                "Chat created ChatId={ChatId} Caller={CallerId} Other={OtherId}",
                chatId, callerId, otherParticipantId);

            return Result<ChatDto>.Success(new ChatDto(chatId, [callerId, otherParticipantId]));
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }
}
