using HousingApp.Infrastructure.Persistence.Models.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace HousingApp.Infrastructure.Persistence.Models;

[Table("chats")]
public class ChatModel : AuditableModel
{
    public int Id { get; set; }
}
