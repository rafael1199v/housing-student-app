using HousingApp.Infrastructure.Persistence.Models.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HousingApp.Infrastructure.Persistence.Models;

[Table("booking_statuses")]
public class BookingStatusModel : AuditableModel
{
    public int Id { get; set; }

    [Required][MaxLength(50)] public string Name { get; set; } = string.Empty;
}
