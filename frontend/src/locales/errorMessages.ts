const es: Record<string, string> = {
	// Auth
	"invalid.credentials": "Credenciales inválidas",

	// Register
	"role.not.exist": "El rol no existe",
	"admin.role.denied":
		"No tienes permisos para crear una cuenta con estos privilegios",
	"email.in.use": "El email ya está en uso",

	// Room
	"room.invalid.price.range": "El rango de precio es inválido",
	"room.householder.not.found": "No se encontró el propietario del alojamiento",
	"room.invalid.name": "El nombre del alojamiento es inválido",
	"room.invalid.description": "La descripción del alojamiento es inválida",
	"room.invalid.latitude": "La latitud es inválida",
	"room.invalid.longitude": "La longitud es inválida",
	"room.invalid.price": "El precio del alojamiento es inválido",
	"room.invalid.status": "El estado del alojamiento es inválido",
	"room.invalid.image.type": "Solo se permiten archivos de imagen",
	"room.not.found": "El alojamiento no fue encontrado",
	"room.filter.not.exist": "El filtro indicado no existe",
	"room.filter.invalid.value": "El valor del filtro indicado no es válido",
	"room.images.max.exceeded":
		"Se excedió la cantidad máxima de imágenes permitidas",

	// Booking
	"booking.room.not.available":
		"El alojamiento no está disponible para reservar",
	"booking.booker.not.found": "El estudiante no fue encontrado",
	"booking.room.already.booked": "Ya hiciste una reserva para este alojamiento",
	"booking.already.approved": "La reserva ya fue aprobada",
	"booking.already.denied": "La reserva ya fue denegada",
	"booking.already.completed": "La reserva ya fue completada",
	"booking.not.found": "La reserva no fue encontrada",
	"booking.invalid.status": "El estado de la reserva es inválido",
	"booking.could.not.change.status":
		"No se pudo cambiar el estado de la reserva",

	// Server
	"unknown.error": "Ha ocurrido un error inesperado",

	// Client
	"no.internet.connection": "No tienes conexión a internet. Inténtalo de nuevo mas tarde"
};

export const errorMessages = {
	es,
};

export function getErrorMessage(code: string, fallback?: string): string {
	return (
		errorMessages.es[code] ??
		fallback ??
		"Hubo un error en la solicitud, intente nuevamente."
	);
}
