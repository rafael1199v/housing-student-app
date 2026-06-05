using HousingApp.Application.Chat.DTOs;
using HousingApp.Application.Repositories;
using HousingApp.Infrastructure.Persistence.Context;
using HousingApp.Infrastructure.Persistence.Models;
using Microsoft.EntityFrameworkCore;

namespace HousingApp.Infrastructure.Persistence.Repositories;

public class ChatRepository(HousingApplicationDbContext context) : IChatRepository
{
    public async Task<(string OwnerId, string RoomName)?> GetRoomOwnerAsync(int roomId)
    {
        var room = await context.Rooms
            .AsNoTracking()
            .Where(r => r.Id == roomId && !r.IsDeleted)
            .Select(r => new { r.PersonId, r.Name })
            .FirstOrDefaultAsync();

        return room is null ? null : (room.PersonId, room.Name);
    }

    public async Task<int?> FindRoomChatIdAsync(int roomId, string userA, string userB)
    {
        return await context.Chats
            .AsNoTracking()
            .Where(c => c.RoomId == roomId && !c.IsDeleted)
            .Where(c => context.ChatParticipants.Any(p => p.ChatId == c.Id && p.UserId == userA && !p.IsDeleted)
                        && context.ChatParticipants.Any(p => p.ChatId == c.Id && p.UserId == userB && !p.IsDeleted))
            .Select(c => (int?)c.Id)
            .FirstOrDefaultAsync();
    }

    public async Task<int> CreateChatAsync(Domain.Entities.Chat chat, IEnumerable<string> participantIds)
    {
        ChatModel chatModel = new() { RoomId = chat.RoomId };
        await context.Chats.AddAsync(chatModel);
        await context.SaveChangesAsync();

        foreach (string userId in participantIds)
        {
            await context.ChatParticipants.AddAsync(new ChatParticipantModel
            {
                ChatId = chatModel.Id,
                UserId = userId
            });
        }

        await context.SaveChangesAsync();
        return chatModel.Id;
    }

    public async Task<bool> IsParticipantAsync(int chatId, string userId)
    {
        return await context.ChatParticipants
            .AnyAsync(p => p.ChatId == chatId && p.UserId == userId && !p.IsDeleted);
    }

    public async Task<MessageDto> AddMessageAsync(Domain.Entities.ChatMessage message)
    {
        ChatMessageModel model = new()
        {
            ChatId = message.ChatId,
            SenderId = message.SenderId,
            Message = message.Message
        };

        await context.ChatMessages.AddAsync(model);
        await context.SaveChangesAsync();

        string senderName = await context.Persons
            .AsNoTracking()
            .Where(p => p.UserId == message.SenderId)
            .Select(p => p.LastName == null ? p.FirstName : p.FirstName + " " + p.LastName)
            .FirstOrDefaultAsync() ?? string.Empty;

        return new MessageDto(model.Id, model.ChatId, model.SenderId, senderName, model.Message, model.CreatedAt);
    }

    public async Task<List<int>> GetChatIdsForUserAsync(string userId)
    {
        return await context.ChatParticipants
            .AsNoTracking()
            .Where(p => p.UserId == userId && !p.IsDeleted && !p.Chat.IsDeleted)
            .Select(p => p.ChatId)
            .ToListAsync();
    }

    public async Task<List<MessageDto>> GetMessagesAsync(int chatId, int? beforeMessageId, int pageSize)
    {
        return await (
                from m in context.ChatMessages.AsNoTracking()
                where m.ChatId == chatId && !m.IsDeleted
                      && (beforeMessageId == null || m.Id < beforeMessageId)
                join p in context.Persons on m.SenderId equals p.UserId into senders
                from sender in senders.DefaultIfEmpty()
                orderby m.Id descending
                select new MessageDto(
                    m.Id,
                    m.ChatId,
                    m.SenderId,
                    sender == null
                        ? string.Empty
                        : (sender.LastName == null ? sender.FirstName : sender.FirstName + " " + sender.LastName),
                    m.Message,
                    m.CreatedAt))
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<List<ChatSummaryDto>> GetUserChatsAsync(string userId)
    {
        var memberships = await context.ChatParticipants
            .AsNoTracking()
            .Where(cp => cp.UserId == userId && !cp.IsDeleted && !cp.Chat.IsDeleted)
            .Select(cp => new
            {
                cp.ChatId,
                cp.Chat.RoomId,
                RoomName = cp.Chat.Room != null ? cp.Chat.Room.Name : null,
                cp.LastReadMessageId
            })
            .ToListAsync();

        if (memberships.Count == 0)
        {
            return [];
        }

        List<int> chatIds = memberships.Select(m => m.ChatId).ToList();

        var others = await context.ChatParticipants
            .AsNoTracking()
            .Where(p => chatIds.Contains(p.ChatId) && p.UserId != userId && !p.IsDeleted)
            .Join(context.Persons,
                p => p.UserId,
                person => person.UserId,
                (p, person) => new
                {
                    p.ChatId,
                    person.UserId,
                    Name = person.LastName == null ? person.FirstName : person.FirstName + " " + person.LastName
                })
            .ToListAsync();

        var otherByChat = others
            .GroupBy(o => o.ChatId)
            .ToDictionary(g => g.Key, g => g.First());

        List<int> lastMessageIds = await context.ChatMessages
            .AsNoTracking()
            .Where(m => chatIds.Contains(m.ChatId) && !m.IsDeleted)
            .GroupBy(m => m.ChatId)
            .Select(g => g.Max(m => m.Id))
            .ToListAsync();

        var lastByChat = (await context.ChatMessages
                .AsNoTracking()
                .Where(m => lastMessageIds.Contains(m.Id))
                .Select(m => new { m.ChatId, m.Message, m.CreatedAt })
                .ToListAsync())
            .ToDictionary(m => m.ChatId, m => m);

        var unreadByChat = (await context.ChatMessages
                .AsNoTracking()
                .Where(m => chatIds.Contains(m.ChatId) && !m.IsDeleted && m.SenderId != userId)
                .Join(context.ChatParticipants.Where(p => p.UserId == userId && !p.IsDeleted),
                    m => m.ChatId,
                    p => p.ChatId,
                    (m, p) => new { m.ChatId, m.Id, p.LastReadMessageId })
                .Where(x => x.LastReadMessageId == null || x.Id > x.LastReadMessageId)
                .GroupBy(x => x.ChatId)
                .Select(g => new { ChatId = g.Key, Count = g.Count() })
                .ToListAsync())
            .ToDictionary(x => x.ChatId, x => x.Count);

        return memberships
            .Select(m =>
            {
                otherByChat.TryGetValue(m.ChatId, out var other);
                lastByChat.TryGetValue(m.ChatId, out var last);
                unreadByChat.TryGetValue(m.ChatId, out int unread);

                return new ChatSummaryDto(
                    m.ChatId,
                    m.RoomId,
                    m.RoomName,
                    other?.UserId ?? string.Empty,
                    other?.Name ?? string.Empty,
                    last?.Message,
                    last?.CreatedAt,
                    unread);
            })
            .OrderByDescending(c => c.LastMessageAt ?? DateTime.MinValue)
            .ToList();
    }

    public async Task<bool> MarkAsReadAsync(int chatId, string userId, int lastMessageId)
    {
        int affected = await context.ChatParticipants
            .Where(p => p.ChatId == chatId && p.UserId == userId && !p.IsDeleted
                        && (p.LastReadMessageId == null || p.LastReadMessageId < lastMessageId))
            .ExecuteUpdateAsync(setters => setters.SetProperty(p => p.LastReadMessageId, lastMessageId));

        return affected > 0;
    }
}
