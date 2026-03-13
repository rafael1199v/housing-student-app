namespace HousingApp.Domain.Entities
{
    public class User
    {
        public string Id { get; private set; } = string.Empty;
        public string Email { get; private set; } = string.Empty;
        public string Password { get; private set; } = string.Empty;
        
        public List<string> Roles { get; private set; } = []; 

        public static User CreateUser(string email, string password)
        {
            return new User { Id = "uuid", Email = email, Password = password };
        }
        
        public static User CreateUser(string uuid, string email, string password, List<string> roles)
        {
            return new User { Id = uuid, Email = email, Password = password , Roles = roles };
        }
    }
}