namespace HousingApp.Application.Roles;

public static class RoleHierarchy
{
    private static readonly IReadOnlyDictionary<string, int> Ranks =
        new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase)
        {
            [RolesDescription.Student] = 1,
            [RolesDescription.Householder] = 2,
            [RolesDescription.Admin] = 3,
        };

    public static bool IsKnownRole(string role) =>
        !string.IsNullOrWhiteSpace(role) && Ranks.ContainsKey(role);

    public static int RankOf(string role) =>
        role is not null && Ranks.TryGetValue(role, out int rank) ? rank : 0;

    public static int HighestRank(IEnumerable<string> heldRoles) =>
        heldRoles is null ? 0 : heldRoles.Select(RankOf).DefaultIfEmpty(0).Max();

    public static bool CanSelfAssign(IEnumerable<string> currentRoles, string targetRole)
    {
        if (!IsKnownRole(targetRole))
        {
            return false;
        }

        if (string.Equals(targetRole, RolesDescription.Admin, StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        List<string> held = currentRoles?.ToList() ?? [];

        if (held.Contains(targetRole, StringComparer.OrdinalIgnoreCase))
        {
            return false;
        }

        return RankOf(targetRole) < HighestRank(held);
    }
}
