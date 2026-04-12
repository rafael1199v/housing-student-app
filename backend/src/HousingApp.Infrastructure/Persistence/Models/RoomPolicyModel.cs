using HousingApp.Infrastructure.Persistence.Models.Common;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HousingApp.Infrastructure.Persistence.Models;

[Table("rooms_policies")]
[PrimaryKey(nameof(RoomId), nameof(PolicyId))]
public class RoomPolicyModel : AuditableModel
{
    public int RoomId { get; set; }
    public RoomModel Room { get; set; } = null!;

    public int PolicyId { get; set; }
    public PolicyModel Policy { get; set; } = null!;

    [Required][MaxLength(500)] public string Description { get; set; } = string.Empty;
}
