namespace HousingApp.Domain.Error
{
    public static class ServerError
    {
        public static readonly Error UnknownError = new("unknown.error", "Ha ocurrido un error inesperado");
    }
}