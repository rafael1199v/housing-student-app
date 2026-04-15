namespace HousingApp.Domain.Error;

public static class AuthError
{
    public static readonly Error InvalidCredentials = new("invalid.credentials", "Credenciales invalidas");
    public static readonly Error InvalidUserId = new("invalid.user.id", "Identificador del usuario invalido");
}
