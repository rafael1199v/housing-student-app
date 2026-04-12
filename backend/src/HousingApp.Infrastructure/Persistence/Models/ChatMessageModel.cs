using HousingApp.Infrastructure.Persistence.Models.Common;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HousingApp.Infrastructure.Persistence.Models;

[Table("chat_messages")]
public class ChatMessageModel : AuditableModel
{
    public int Id { get; set; }

    public int ChatId { get; set; }
    public ChatModel Chat { get; set; } = null!;

    [Required][MaxLength(450)] public string SenderId { get; set; } = string.Empty;
    public IdentityUser Sender { get; set; } = null!;

    [Required][MaxLength(1024)] public string Message { get; set; } = string.Empty;
}
