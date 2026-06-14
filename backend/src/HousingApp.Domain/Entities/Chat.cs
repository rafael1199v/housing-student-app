using HousingApp.Domain.Enums;

namespace HousingApp.Domain.Entities;

public class Chat
{
    public required int Id { get; init; }
    public required ChatType ChatType { get; init; }

    public string? DirectKey { get; init; }

    public static string BuildDirectKey(string userA, string userB)
    {
        return string.CompareOrdinal(userA, userB) <= 0
            ? $"{userA}|{userB}"
            : $"{userB}|{userA}";
    }
}
