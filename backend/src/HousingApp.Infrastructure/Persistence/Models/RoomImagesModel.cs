using HousingApp.Infrastructure.Persistence.Models.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace HousingApp.Infrastructure.Persistence.Models;

[Table("room_images")]
public class RoomImagesModel : AuditableModel
{
    public int Id { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public int RoomId { get; set; }
    public RoomModel Room { get; set; } = null!;
}
