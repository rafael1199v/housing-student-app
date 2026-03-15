using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HousingApp.Infrastructure.Persistence.Models
{
    [Table("rooms")]
    public class RoomModel
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        
        [Required,  MaxLength(300)]
        public string Description { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(10, 2)")]
        public decimal Price { get; set; }

        [Required, MaxLength(450)]
        public string PersonId { get; set; } = string.Empty;
        public PersonModel Person { get; set; } = null!;
        
        public int RoomStatusId { get; set; }
        public RoomStatusModel RoomStatus { get; set; } = null!;
        
        public DateTime? UpdatedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? DeletedAt { get; set; }
        public bool IsDeleted { get; set; } = false;

        public ICollection<RoomImagesModel> RoomImages { get; set; } = [];
        public ICollection<BookingModel> Bookings { get; set; } = [];
    }
}