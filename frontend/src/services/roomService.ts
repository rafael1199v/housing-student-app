import type { RoomData } from "../features/home/types/roomDataDto";
import type { CreateRoomDto } from "../features/new-room/types/createRoomDto";
import type { RoomHouseholderDto } from "../features/owner-home/types/roomHouseholderDto";
import type { RoomHouseholderDetailDto } from "../features/owner-room-details/types/roomHouseholderDetailDto";
import type { RoomDto } from "../features/room-details/types/roomDto";
import { api } from "./apiService";

export interface RoomSearchParams {
	name?: string;
	minPrice?: string;
	maxPrice?: string;
}

const roomService = {
	getRooms: async () => api.get<RoomData[]>("/api/rooms"),
	searchRooms: async (params: RoomSearchParams) => {
		const query = new URLSearchParams();
		if (params.name) query.set("name", params.name);
		if (params.minPrice) query.set("minPrice", params.minPrice);
		if (params.maxPrice) query.set("maxPrice", params.maxPrice);
		const qs = query.size > 0 ? `?${query.toString()}` : "";
		return api.get<RoomData[]>(`/api/rooms${qs}`);
	},
	getRoomById: async (id: string) => api.get<RoomDto>(`/api/rooms/${id}`),
	getHouseholderRooms: async () => {
		return api.get<RoomHouseholderDto[]>("/api/rooms/householder");
	},
	createBooking: async (roomId: string) =>
		api.post<void>("/api/bookings", JSON.stringify({ roomId })),
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

		return api.post<void>("/api/rooms", formData);
	},
	getHouseholderRoomDetail: async (id: string) =>
		api.get<RoomHouseholderDetailDto>(`/api/rooms/householder/${id}`),
	approveBooking: async (bookingId: number) =>
		api.put<void>(`/api/bookings/approve/${bookingId}`, bookingId),
};

export default roomService;
