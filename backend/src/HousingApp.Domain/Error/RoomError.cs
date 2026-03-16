using System.Net;

namespace HousingApp.Domain.Error
{
    public static class RoomError
    {
        public static readonly Error InvalidPriceRange = new("room.invalid.price.range", "El rango de precio es inválido");
        public static readonly Error HouseholderNotFound = new("room.householder.not.found", "No se encontró el propietario del alojamiento");
        public static readonly Error InvalidName = new("room.invalid.name", "El nombre del alojamiento es inválido");
        public static readonly Error InvalidDescription = new("room.invalid.description", "La descripción del alojamiento es inválida");
        public static readonly Error InvalidLatitude = new("room.invalid.latitude", "La latitud es inválida");
        public static readonly Error InvalidLongitude = new("room.invalid.longitude", "La longitud es inválida");
        public static readonly Error InvalidPrice = new("room.invalid.price", "El precio del alojamiento es inválido");
        public static readonly Error InvalidRoomStatus = new("room.invalid.status", "El estado del alojamiento es inválido");
        public static readonly Error InvalidImageType = new("room.invalid.image.type", "Solo se permiten archivos de imagen");
            
        public static Error FilterDoesNotExist(string filter)
            => new("room.filter.not.exist", $"El filtro '{filter}' no existe");

        public static Error InvalidFilterValue(string filter)
            => new("room.filter.invalid.value", $"El valor del filtro '{filter}' no es válido");

        public static Error MaxImagesExceeded(int maxImages)
            => new("room.images.max.exceeded", $"La cantidad máxima de imágenes es {maxImages}");

        public static readonly Error RoomNotFound = new("room.not.found", "El alojamiento no fue encontrado");
    }
}