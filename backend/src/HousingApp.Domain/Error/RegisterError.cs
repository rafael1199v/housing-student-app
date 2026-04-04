namespace HousingApp.Domain.Error;

public static class RegisterError
{
    public static readonly Error RolDoesNotExist = new("role.not.exist", "El rol no existe");

    public static readonly Error DeniedAdminCreation = new("admin.role.denied",
        "No tienes permisos para crear una cuenta con estos privilegios");

    public static readonly Error EmailAlreadyInUse = new("email.in.use", "El email ya está en uso");
}
