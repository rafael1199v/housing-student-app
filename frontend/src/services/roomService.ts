import type { RoomData } from "../features/home/types/roomDataDto";
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
};

export default roomService;
