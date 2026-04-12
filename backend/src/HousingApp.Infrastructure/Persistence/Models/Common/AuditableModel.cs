namespace HousingApp.Infrastructure.Persistence.Models.Common;

public abstract class AuditableModel
{
    public DateTime? UpdatedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedAt { get; set; }
    public bool IsDeleted { get; set; } = false;
}
