using System.Net;

namespace HousingApp.Domain.Error
{
    public static class RoomError
    {
        public static readonly Error InvalidPriceRange = new("room.invalid.price.range", "El rango de precio es inválido");

        public static Error FilterDoesNotExist(string filter)
            => new("room.filter.not.exist", $"El filtro '{filter}' no existe");

        public static Error InvalidFilterValue(string filter)
            => new("room.filter.invalid.value", $"El valor del filtro '{filter}' no es válido");

        public static readonly Error RoomNotFound = new("room.not.found", "El alojamiento no fue encontrado");
    }
}