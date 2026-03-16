import type { RoomData } from "../features/home/types/roomDataDto";
import type { CreateRoomDto } from "../features/new-room/types/createRoomDto";
import type { RoomHouseholderDto } from "../features/owner-home/types/roomHouseholderDto";
import type { RoomHouseholderDetailDto } from "../features/owner-room-details/types/roomHouseholderDetailDto";
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
	getHouseholderRooms: async () => {
		return apiFetch<RoomHouseholderDto[]>("/api/room/householder");
	},
	createBooking: async (roomId: string) => {
		return apiFetch<void>("/api/booking", {
			method: "POST",
			body: JSON.stringify({ roomId }),
		});
	},
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

		return apiFetch<void>("/api/room", {
			method: "POST",
			body: formData,
		});
	},
	getHouseholderRoomDetail: async (id: string) => {
		return apiFetch<RoomHouseholderDetailDto>(`/api/room/householder/${id}`);
	},
	approveBooking: async (bookingId: number, roomId: number) => {
		// TODO: Update API calls when backend endpoints are ready
		// PUT /api/room/{roomId} -> update room status to "booked"
		// PUT /api/booking/{bookingId} -> update booking status to "approved"
		// PUT /api/booking (bulk) -> reject other bookings for this room
		return apiFetch<void>(`/api/booking/${bookingId}/approve`, {
			method: "PUT",
			body: JSON.stringify({ roomId }),
		});
	},
};

export default roomService;
