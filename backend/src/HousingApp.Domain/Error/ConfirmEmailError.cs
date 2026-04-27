namespace HousingApp.Domain.Error;

public static class ConfirmEmailError
{
    public static readonly Error InvalidEmailConfirmationToken =
        new("invalid.confirmation.email.token", "El token para confirmar el email es invalido");

    public static readonly Error EmailAlreadyConfirmed =
        new("email.already.confirmed", "El email ya ha sido confirmado");
}
