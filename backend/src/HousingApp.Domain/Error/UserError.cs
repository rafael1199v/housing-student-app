namespace HousingApp.Domain.Error;

public static class UserError
{
    public static readonly Error UserNotFound = new("user.not.found", "User not found.");
    public static readonly Error InvalidUserId = new("user.invalid.id", "User id is required.");
    public static readonly Error PersonProfileNotFound = new("person.not.found", "Person profile not found.");
    public static readonly Error RoleAlreadyAssigned = new("user.role.already.assigned", "The role is already assigned to the user.");
    public static readonly Error RoleNotAssignable = new("user.role.not.assignable", "You cannot assign this role.");
    public static readonly Error InvalidRole = new("user.role.invalid", "The specified role is invalid.");
    public static readonly Error RoleAssignmentFailed = new("user.role.assignment.failed", "The role could not be assigned.");
}
