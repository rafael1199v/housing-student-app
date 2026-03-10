namespace HousingApp.Domain.Error
{
    public static class AuthError
    {
        public static readonly Error InvalidCredentials = new("invalid.credentials", "Credenciales invalidas");
    }
}