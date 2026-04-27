namespace HousingApp.Domain.Entities;

public class User
{
    public string Id { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string? Password { get; private set; } = string.Empty;

    public bool IsEmailConfirmed { get; private set; }

    public List<string> Roles { get; private set; } = [];

    public static User CreateUser(string email, string password)
    {
        return new User { Id = "uuid", Email = email, Password = password, IsEmailConfirmed = false };
    }

    public static User CreateUser(string uuid, string email, string password, List<string> roles, bool isEmailConfirmed = false)
    {
        return new User { Id = uuid, Email = email, Password = password, Roles = roles, IsEmailConfirmed = isEmailConfirmed };
    }

    public static User CreateExternalLoginUser(string email)
    {
        return new User { Id = "uuid", Email = email, Password = null, IsEmailConfirmed = true };
    }

    public bool IsExternalLogin => Password is null;
}
