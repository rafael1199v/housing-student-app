namespace HousingApp.Domain.Error;

public static class AuthError
{
    public static readonly Error InvalidCredentials = new("invalid.credentials", "Credenciales invalidas");
    public static readonly Error InvalidUserId = new("invalid.user.id", "Identificador del usuario invalido");
    public static readonly Error RefreshTokenExpired = new("refresh.token.expired", "El refresh token está expirado");
    public static readonly Error EmailNotConfirmed = new("email.not.confirmed", "El email no ha sido confirmado");
}
