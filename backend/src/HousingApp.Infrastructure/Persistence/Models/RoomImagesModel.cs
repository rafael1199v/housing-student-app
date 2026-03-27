using System.ComponentModel.DataAnnotations.Schema;

namespace HousingApp.Infrastructure.Persistence.Models
{
    [Table("room_images")]
    public class RoomImagesModel
    {
        public int Id { get; set; }

        public string ImageUrl { get; set; } = string.Empty;

        public int RoomId { get; set; }
        public RoomModel Room { get; set; } = null!;

        public DateTime? UpdatedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? DeletedAt { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}