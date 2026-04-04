using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HousingApp.Infrastructure.Persistence.Models;

[Table("persons")]
public class PersonModel
{
    [Key] [MaxLength(450)] public string UserId { get; set; } = string.Empty;

    [ForeignKey("UserId")] public IdentityUser User { get; set; } = null!;

    [Required] [MaxLength(150)] public string FirstName { get; set; } = string.Empty;

    [Required] [MaxLength(150)] public string LastName { get; set; } = string.Empty;

    [Required] [MaxLength(300)] public string Email { get; set; } = string.Empty;

    [Required] [MaxLength(50)] public string PhoneNumber { get; set; } = string.Empty;

    [Required] [MaxLength(50)] public string Nationality { get; set; } = string.Empty;

    public int Age { get; set; }

    [Required] [MaxLength(30)] public string Gender { get; set; } = string.Empty;

    [MaxLength(500)] public string? ImageUrl { get; set; }

    public DateOnly BirthDate { get; set; }

    public bool IsDeleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}
