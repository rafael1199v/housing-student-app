namespace HousingApp.Domain.Error;

public static class BookingError
{
    public static readonly Error RoomNotAvailable =
        new("booking.room.not.available", "El alojamiento no está disponible para reservar");

    public static readonly Error BookerNotFound =
        new("booking.booker.not.found", "El estudiante no fue encontrado");

    public static readonly Error RoomAlreadyBooked =
        new("booking.room.already.booked", "Ya hiciste una reserva para este alojamiento");

    public static readonly Error BookingAlreadyApproved =
        new("booking.already.approved", "La reserva ya fue aprobada");

    public static readonly Error BookingAlreadyDenied =
        new("booking.already.denied", "La reserva ya fue denegada");

    public static readonly Error BookingAlreadyCompleted =
        new("booking.already.completed", "La reserva ya fue completada");

    public static readonly Error BookingNotFound =
        new("booking.not.found", "La reserva no fue encontrada");

    public static readonly Error BookingInvalidStatus =
        new("booking.invalid.status", "El estado de la reserva es invalida");

    public static readonly Error BookingCouldNotChangeStatus =
        new("booking.could.not.change.status", "No se pudo cambiar el estado de la reserva");
}
