import type { RoomData } from "../features/home/types/roomDataDto";
import type { RoomDto } from "../features/room-details/types/roomDto";
import { apiFetch } from "./apiService";

export interface RoomSearchParams {
	name?: string;
	minPrice?: string;
	maxPrice?: string;
}

const roomService = {
	getRooms: async () => {
		return apiFetch<RoomData[]>("/api/room");
	},
	searchRooms: async (params: RoomSearchParams) => {
		const query = new URLSearchParams();
		if (params.name) query.set("name", params.name);
		if (params.minPrice) query.set("minPrice", params.minPrice);
		if (params.maxPrice) query.set("maxPrice", params.maxPrice);
		const qs = query.size > 0 ? `?${query.toString()}` : "";
		return apiFetch<RoomData[]>(`/api/room${qs}`);
	},
	getRoomById: async (id: string) => {
		return apiFetch<RoomDto>(`/api/room/${id}`);
	},
	createBooking: async (roomId: string) => {
		return apiFetch<void>("/api/booking", {
			method: "POST",
			body: JSON.stringify({ roomId }),
		});
	},
};

export default roomService;
