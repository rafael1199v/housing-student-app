using HousingApp.Domain.Enums;
using HousingApp.Infrastructure.Persistence.Models.Common;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HousingApp.Infrastructure.Persistence.Models;

[Table("persons")]
[Index(nameof(Email), IsUnique = true)]
public class PersonModel : AuditableModel
{
    [Key][MaxLength(450)] public string UserId { get; set; } = string.Empty;

    [ForeignKey("UserId")] public IdentityUser User { get; set; } = null!;

    [Required][MaxLength(150)] public string FirstName { get; set; } = string.Empty;

    [MaxLength(150)] public string? LastName { get; set; }

    [Required][MaxLength(320)] public string Email { get; set; } = string.Empty;

    [MaxLength(50)] public string? PhoneNumber { get; set; }

    [MaxLength(50)] public string? Nationality { get; set; }

    [MaxLength(30)] public string? Gender { get; set; }

    [MaxLength(500)] public string? ImageUrl { get; set; }

    public AvatarSource ImageSource { get; set; } = AvatarSource.None;
    
    public DateOnly? BirthDate { get; set; }
}
