import type { RoomData } from "../features/home/types/roomDataDto";
import type { CreateRoomDto } from "../features/new-room/types/createRoomDto";
import type { RoomHouseholderDto } from "../features/owner-home/types/roomHouseholderDto";
import type { RoomHouseholderDetailDto } from "../features/owner-room-details/types/roomHouseholderDetailDto";
import type { RoomDto } from "../features/room-details/types/roomDto";
import { api, apiFetch } from "./apiService";

export interface RoomSearchParams {
	name?: string;
	minPrice?: string | number;
	maxPrice?: string | number;
	longitude?: string | number;
	latitude?: string | number;
}

const roomService = {
	getRooms: async () => api.get<RoomData[]>("/api/rooms"),
	searchRooms: async (params: RoomSearchParams) => {
		const query = new URLSearchParams();
		if (params.name) query.set("name", params.name);
		if (params.minPrice !== undefined && params.minPrice !== "") {
			query.set("minPrice", String(params.minPrice));
		}
		if (params.maxPrice !== undefined && params.maxPrice !== "") {
			query.set("maxPrice", String(params.maxPrice));
		}
		if (params.latitude !== undefined && params.latitude !== "") {
			query.set("latitude", String(params.latitude));
		}
		if (params.longitude !== undefined && params.longitude !== "") {
			query.set("longitude", String(params.longitude));
		}
		const qs = query.size > 0 ? `?${query.toString()}` : "";
		return api.get<RoomData[]>(`/api/rooms${qs}`);
	},
	roomAlreadyBooked: async (roomId: string) =>
		api.get<boolean>(`/api/bookings/${roomId}`),
	getRoomById: async (id: string) => api.get<RoomDto>(`/api/rooms/${id}`),
	getHouseholderRooms: async () => {
		return api.get<RoomHouseholderDto[]>("/api/rooms/householder");
	},
	createBooking: async (roomId: string) =>
		api.post<void>("/api/bookings", { roomId }),
	deleteBooking: async (roomId: string) =>
		api.delete<void>(`/api/bookings/${roomId}`),
	createRoom: async (dto: CreateRoomDto) => {
		const formData = new FormData();
		formData.append("name", dto.name);
		formData.append("latitude", String(dto.latitude));
		formData.append("longitude", String(dto.longitude));
		formData.append("description", dto.description);
		formData.append("price", String(dto.price));
		formData.append("roomStatusId", String(dto.roomStatus));

		for (const imageFile of dto.imageRoomFiles) {
			formData.append("images", imageFile);
		}

		return apiFetch<void>("/api/rooms", { body: formData, method: "POST" });
	},
	getHouseholderRoomDetail: async (id: string) =>
		api.get<RoomHouseholderDetailDto>(`/api/rooms/householder/${id}`),
	approveBooking: async (bookingId: number) =>
		api.put<void>(`/api/bookings/approve/${bookingId}`, bookingId),
};

export default roomService;
