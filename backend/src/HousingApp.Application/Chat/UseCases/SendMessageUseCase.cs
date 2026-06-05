using HousingApp.Application.Chat.DTOs;
using HousingApp.Application.Repositories;
using HousingApp.Domain.Error;

namespace HousingApp.Application.Chat.UseCases;

public class SendMessageUseCase(IChatRepository chatRepository) : ISendMessageUseCase
{
    private const int MaxMessageLength = 1024;

    public async Task<Result<MessageDto>> ExecuteAsync(string senderId, int chatId, string message)
    {
        string trimmed = message?.Trim() ?? string.Empty;

        if (string.IsNullOrEmpty(trimmed))
        {
            return Result<MessageDto>.Failure(ChatError.EmptyMessage);
        }

        if (trimmed.Length > MaxMessageLength)
        {
            return Result<MessageDto>.Failure(ChatError.MessageTooLong(MaxMessageLength));
        }

        if (!await chatRepository.IsParticipantAsync(chatId, senderId))
        {
            return Result<MessageDto>.Failure(ChatError.NotAParticipant);
        }

        MessageDto created = await chatRepository.AddMessageAsync(new Domain.Entities.ChatMessage
        {
            Id = 0,
            ChatId = chatId,
            SenderId = senderId,
            Message = trimmed
        });

        return Result<MessageDto>.Success(created);
    }
}
