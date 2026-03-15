namespace HousingApp.Domain.Error
{
    public static class BookingError
    {
        public static readonly Error RoomNotAvailable =
            new("booking.room.not.available", "El alojamiento no está disponible para reservar");

        public static readonly Error BookerNotFound =
            new("booking.booker.not.found", "El estudiante no fue encontrado");

        public static readonly Error RoomAlreadyBooked =
            new("booking.room.already.booked", "Ya hiciste una reserva para este alojamiento");
    }
}