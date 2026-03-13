import type { RoomData } from "../features/home/types/roomDataDto";
import { apiFetch } from "./apiService";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const roomService = {
	getRooms: async () => {
		await delay(2000);
		return apiFetch<RoomData[]>("/rooms", { baseURL: "http://localhost:3000" });
	},
};

export default roomService;
