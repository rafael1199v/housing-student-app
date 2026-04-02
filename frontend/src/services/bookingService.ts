import type { BookingData } from "../features/bookings/types/bookingDataDto";
import { api } from "./apiService";

const bookingService = {
	approveBooking: async (bookingId: number) =>
		api.put<void>(`/api/bookings/approve/${bookingId}`, bookingId),
	rejectBooking: async (bookingId: number) =>
		api.put<void>(`/api/bookings/reject/${bookingId}`, bookingId),
	createBooking: async (roomId: string) =>
		api.post<void>("/api/bookings", { roomId }),
	deleteBooking: async (roomId: string) =>
		api.delete<void>(`/api/bookings/${roomId}`),
	getBookedRooms: async () => api.get<BookingData[]>(`/api/bookings`),
};

export default bookingService;
