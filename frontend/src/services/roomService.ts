import type { RoomData } from "../features/home/types/roomDataDto";
import { apiFetch } from "./apiService";

const roomService = {
	getRooms: async () => {
		return apiFetch<RoomData[]>("/api/room");
	},
};

export default roomService;
