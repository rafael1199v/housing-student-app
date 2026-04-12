using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HousingApp.Infrastructure.Persistence.Models;

[Table("refresh_tokens")]
public class RefreshToken
{
    public int Id { get; set; }

    [Required][MaxLength(300)] public string Token { get; set; } = string.Empty;
    public DateTime ExpirationOnUtc { get; set; }

    [Required][MaxLength(450)] public string UserId { get; set; } = string.Empty;
    public IdentityUser User { get; set; } = null!;

    public bool IsRevoked { get; set; }
    public DateTime CreatedAt { get; set; }
}
