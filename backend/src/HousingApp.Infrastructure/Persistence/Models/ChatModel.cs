using HousingApp.Domain.Enums;
using HousingApp.Infrastructure.Persistence.Models.Common;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HousingApp.Infrastructure.Persistence.Models;

[Table("chats")]
[Index(nameof(DirectKey), IsUnique = true)]
public class ChatModel : AuditableModel
{
    public int Id { get; set; }

    public ChatType ChatType { get; set; }

    // Null for group chats; unique among direct chats (one per participant pair).
    [MaxLength(911)]
    public string? DirectKey { get; set; }
}
