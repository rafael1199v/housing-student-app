using HousingApp.Application.Chat.DTOs;
using HousingApp.Application.UnitOfWork;
using HousingApp.Domain.Error;
using Microsoft.Extensions.Logging;

namespace HousingApp.Application.Chat.UseCases;

public class StartChatUseCase(IChatUnitOfWork unitOfWork, ILogger<StartChatUseCase> logger) : IStartChatUseCase
{
    public async Task<Result<ChatDto>> ExecuteAsync(string callerId, int roomId, string? otherUserId)
    {
        (string OwnerId, string RoomName)? room = await unitOfWork.ChatRepository.GetRoomOwnerAsync(roomId);

        if (room is null)
        {
            return Result<ChatDto>.Failure(ChatError.RoomNotFound);
        }

        string ownerId = room.Value.OwnerId;
        string otherParticipantId;

        if (callerId == ownerId)
        {
            // The householder (room owner) initiates: they must name the student.
            if (string.IsNullOrWhiteSpace(otherUserId))
            {
                return Result<ChatDto>.Failure(ChatError.RecipientRequired);
            }

            otherParticipantId = otherUserId;
        }
        else
        {
            // Anyone else (typically the student) initiates: the other side is the room owner.
            otherParticipantId = ownerId;
        }

        if (callerId == otherParticipantId)
        {
            return Result<ChatDto>.Failure(ChatError.CannotChatWithSelf);
        }

        if (!await unitOfWork.PersonRepository.ExistsByUserIdAsync(otherParticipantId))
        {
            return Result<ChatDto>.Failure(ChatError.RecipientNotFound);
        }

        int? existingChatId = await unitOfWork.ChatRepository.FindRoomChatIdAsync(roomId, callerId, otherParticipantId);

        if (existingChatId is not null)
        {
            return Result<ChatDto>.Success(new ChatDto(existingChatId.Value, roomId));
        }

        await unitOfWork.BeginTransactionAsync();

        try
        {
            int chatId = await unitOfWork.ChatRepository.CreateChatAsync(
                new Domain.Entities.Chat { Id = 0, RoomId = roomId },
                [callerId, otherParticipantId]);

            await unitOfWork.CommitTransactionAsync();

            logger.LogInformation(
                "Chat created ChatId={ChatId} RoomId={RoomId} Caller={CallerId} Other={OtherId}",
                chatId, roomId, callerId, otherParticipantId);

            return Result<ChatDto>.Success(new ChatDto(chatId, roomId));
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }
}
