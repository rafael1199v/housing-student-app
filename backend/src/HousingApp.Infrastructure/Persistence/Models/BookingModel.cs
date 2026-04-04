using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HousingApp.Infrastructure.Persistence.Models;

[Table("bookings")]
public class BookingModel
{
    public int Id { get; set; }

    [Required] [MaxLength(450)] public string BookerId { get; set; } = string.Empty;

    public PersonModel Booker { get; set; } = null!;

    public int RoomId { get; set; }
    public RoomModel Room { get; set; } = null!;

    public int BookingStatusId { get; set; }
    public BookingStatusModel BookingStatus { get; set; } = null!;

    public DateTime? UpdatedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedAt { get; set; }
    public bool IsDeleted { get; set; } = false;
}
