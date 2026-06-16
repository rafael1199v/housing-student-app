using HousingApp.Infrastructure.Persistence.Models.Common;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HousingApp.Infrastructure.Persistence.Models;

[Table("chat_participants")]
[PrimaryKey(nameof(ChatId), nameof(UserId))]
public class ChatParticipantModel : AuditableModel
{
    public int ChatId { get; set; }
    public ChatModel Chat { get; set; } = null!;
    [Required][MaxLength(450)] public string UserId { get; set; } = string.Empty;
    public IdentityUser User { get; set; } = null!;
    public int? LastReadMessageId { get; set; }
}
