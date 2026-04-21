namespace HousingApp.Domain.Error;

public static class GoogleAuthError
{
    public static readonly Error InvalidGoogleToken = new("google.token.invalid", "El token de Google es inválido o ha expirado");
}
