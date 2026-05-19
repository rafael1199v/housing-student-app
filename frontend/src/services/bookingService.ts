import type { BookingData } from "../features/bookings/types/bookingDataDto";
import { api } from "./apiService";

const bookingService = {
	approveBooking: (bookingId: number) =>
		api.put<void>(`/api/bookings/approve/${bookingId}`, {}),
	rejectBooking: (bookingId: number) =>
		api.put<void>(`/api/bookings/reject/${bookingId}`, {}),
	createBooking: (roomId: string) =>
		api.post<void>("/api/bookings", { roomId }),
	deleteBooking: (roomId: string) =>
		api.delete<void>(`/api/bookings/${roomId}`),
	getBookedRooms: () => api.get<BookingData[]>(`/api/bookings`),
};

export default bookingService;
