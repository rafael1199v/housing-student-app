namespace HousingApp.Domain.Entities
{
    public class User
    {
        public int Id { get; private set; }
        public string Email { get; private set; } = string.Empty;
        public string Password { get; private set; } = string.Empty;

        public static User CreateUser(string email, string password)
        {
            return new User { Id = 0, Email = email, Password = password };
        }
    }
}