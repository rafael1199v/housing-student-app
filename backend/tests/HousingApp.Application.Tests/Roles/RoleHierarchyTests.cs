using FluentAssertions;
using HousingApp.Application.Roles;

namespace HousingApp.Application.Tests.Roles;

public class RoleHierarchyTests
{
    [Theory]
    [InlineData(RolesDescription.Householder, RolesDescription.Student, true)]   // peer exchange
    [InlineData(RolesDescription.Student, RolesDescription.Householder, true)]   // peer exchange (both ways)
    [InlineData(RolesDescription.Admin, RolesDescription.Householder, true)]
    [InlineData(RolesDescription.Admin, RolesDescription.Student, true)]
    [InlineData(RolesDescription.Householder, RolesDescription.Householder, true)] // equal rank is assignable; duplicate rejection lives in AssignRoleToUserUseCase
    [InlineData(RolesDescription.Student, RolesDescription.Student, true)]
    [InlineData(RolesDescription.Student, RolesDescription.Admin, false)]
    [InlineData(RolesDescription.Householder, RolesDescription.Admin, false)]    // nobody self-assigns admin
    public void CanSelfAssign_RespectsHierarchy(string currentRole, string targetRole, bool expected)
    {
        RoleHierarchy.CanSelfAssign([currentRole], targetRole).Should().Be(expected);
    }

    [Fact]
    public void CanSelfAssign_UnknownTargetRole_ReturnsFalse()
    {
        RoleHierarchy.CanSelfAssign([RolesDescription.Householder], "Wizard").Should().BeFalse();
    }

    [Fact]
    public void HighestRank_UsesMostPrivilegedHeldRole()
    {
        RoleHierarchy.HighestRank([RolesDescription.Student, RolesDescription.Householder])
            .Should().Be(RoleHierarchy.RankOf(RolesDescription.Householder));
    }

    [Fact]
    public void IsKnownRole_UnknownAndEmpty_ReturnsFalse()
    {
        RoleHierarchy.IsKnownRole("Wizard").Should().BeFalse();
        RoleHierarchy.IsKnownRole("").Should().BeFalse();
    }
}
