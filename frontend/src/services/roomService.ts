import type { RoomData } from "../features/home/types/roomDataDto";
import type { CreateRoomDto } from "../features/new-room/types/createRoomDto";
import type { RoomHouseholderDto } from "../features/owner-home/types/roomHouseholderDto";
import type { RoomHouseholderDetailDto } from "../features/owner-room-details/types/roomHouseholderDetailDto";
import type { RoomDto } from "../features/room-details/types/roomDto";
import { compressImages } from "../global/utils/image-compressor";
import { api } from "./apiService";

export interface RoomSearchParams {
	name?: string;
	minPrice?: number;
	maxPrice?: number;
	longitude?: number;
	latitude?: number;
}

function buildRoomFormData(dto: CreateRoomDto): FormData {
	const formData = new FormData();
	formData.append("name", dto.name);
	formData.append("latitude", String(dto.latitude));
	formData.append("longitude", String(dto.longitude));
	formData.append("description", dto.description);
	formData.append("price", String(dto.price));
	formData.append("roomStatusId", String(dto.roomStatus));

	dto.services.forEach((serviceId, index) => {
		formData.append(`Services[${index}].Id`, String(serviceId));
	});

	dto.policies.forEach((policy, index) => {
		formData.append(`Policies[${index}].Id`, String(policy.id));
		formData.append(`Policies[${index}].Description`, policy.description);
	});

	return formData;
}

const roomService = {
	getRooms: () => api.get<RoomData[]>("/api/rooms"),
	searchRooms: (params: RoomSearchParams) => {
		const query = new URLSearchParams(
			Object.entries(params)
				.filter(([, v]) => v !== undefined && v !== "")
				.map(([k, v]) => [k, String(v)]),
		);
		const qs = query.size > 0 ? `?${query}` : "";
		return api.get<RoomData[]>(`/api/rooms${qs}`);
	},
	roomAlreadyBooked: (roomId: string) =>
		api.get<boolean>(`/api/bookings/${roomId}`),
	getRoomById: (id: string) => api.get<RoomDto>(`/api/rooms/${id}`),
	getHouseholderRooms: () =>
		api.get<RoomHouseholderDto[]>("/api/rooms/householder"),
	createRoom: async (dto: CreateRoomDto) => {
		const formData = buildRoomFormData(dto);
		const compressedImages = await compressImages(dto.imageRoomFiles);
		for (const imageFile of compressedImages) {
			formData.append("Images", imageFile);
		}
		return api.post<void>("/api/rooms", formData);
	},
	getHouseholderRoomDetail: (id: string) =>
		api.get<RoomHouseholderDetailDto>(`/api/rooms/householder/${id}`),
};

export default roomService;
