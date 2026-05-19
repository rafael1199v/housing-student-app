using HousingApp.Infrastructure.Persistence.Models.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HousingApp.Infrastructure.Persistence.Models;

[Table("services")]
public class ServiceModel : AuditableModel
{
    public int Id { get; set; }

    [Required][MaxLength(50)] public string Code { get; set; } = string.Empty;
    [Required][MaxLength(100)] public string Name { get; set; } = string.Empty;
    public ICollection<RoomModel> Rooms { get; set; } = [];
}
