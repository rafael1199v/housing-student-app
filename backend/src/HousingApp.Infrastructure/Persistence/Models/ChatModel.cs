using HousingApp.Infrastructure.Persistence.Models.Common;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace HousingApp.Infrastructure.Persistence.Models;

[Table("chats")]
[Index(nameof(RoomId))]
public class ChatModel : AuditableModel
{
    public int Id { get; set; }

    public int? RoomId { get; set; }
    public RoomModel? Room { get; set; }
}
