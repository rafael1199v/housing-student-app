namespace HousingApp.Domain.Entities;

public class Policy
{
    public required int Id { get; init; }
    public string Code { get; init; } = string.Empty;
    public required string Description { get; init; } = string.Empty;
}
