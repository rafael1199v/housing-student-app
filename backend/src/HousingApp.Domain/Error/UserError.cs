namespace HousingApp.Domain.Error;

public static class UserError
{
    public static readonly Error UserNotFound = new("user.not.found", "User not found.");
    public static readonly Error InvalidUserId = new("user.invalid.id", "User id is required.");
    public static readonly Error PersonProfileNotFound = new("person.not.found", "Person profile not found.");
}