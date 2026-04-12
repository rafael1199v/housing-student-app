using HousingApp.Infrastructure.Persistence.Models.Common;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace HousingApp.Infrastructure.Persistence.Models;

[Table("rooms_services")]
[PrimaryKey(nameof(RoomId), nameof(ServiceId))]
public class RoomServiceModel : AuditableModel
{
    public int RoomId { get; set; }
    public RoomModel Room { get; set; } = null!;

    public int ServiceId { get; set; }
    public ServiceModel Service { get; set; } = null!;
}
