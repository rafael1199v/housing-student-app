namespace HousingApp.Domain.Entities;

public class Policy
{
    public required int Id { get; init; }
    public required string Description { get; init; } = string.Empty;
}
