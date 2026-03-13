import type { RoomData } from "../features/home/types/roomDataDto";
import { apiFetch } from "./apiService";

const roomService = {
	getRooms: () =>
		apiFetch<RoomData[]>("/rooms", { baseURL: "http://localhost:3000" }),
};

export default roomService;
