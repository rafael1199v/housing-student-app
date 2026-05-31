import {
	ROOM_POLICY_OPTIONS,
	ROOM_SERVICE_OPTIONS,
} from "../../new-room/shared/roomWizardConfig";
import type { RoomDraftPolicy } from "../../new-room/store/roomDraftStore";
import type {
	RoomHouseholderDetailDto,
	RoomImageInfo,
} from "../../owner-room-details/types/roomHouseholderDetailDto";

const SERVICE_ID_BY_CODE = new Map<string, number>(
	ROOM_SERVICE_OPTIONS.map((service) => [service.code, service.id]),
);

const POLICY_ID_BY_CODE = new Map<string, number>(
	ROOM_POLICY_OPTIONS.map((policy) => [policy.code, policy.id]),
);

// Backend serializes RoomStatus enum names; the wizard uses the numeric ids.
const ROOM_STATUS_VALUE_BY_NAME: Record<string, number> = {
	Available: 1,
	Unavailable: 2,
	Booked: 3,
};

export interface EditRoomInitialData {
	name: string;
	description: string;
	price: number;
	roomStatus: number;
	latitude: number;
	longitude: number;
	selectedServices: number[];
	policies: RoomDraftPolicy[];
	existingImages: RoomImageInfo[];
}

export function mapDetailToEditData(
	room: RoomHouseholderDetailDto,
): EditRoomInitialData {
	const selectedServices = room.services
		.map((code) => SERVICE_ID_BY_CODE.get(code))
		.filter((id): id is number => id !== undefined);

	const policies = room.policies
		.map((policy) => {
			const id = POLICY_ID_BY_CODE.get(policy.code);
			return id === undefined ? null : { id, description: policy.description };
		})
		.filter((policy): policy is RoomDraftPolicy => policy !== null);

	return {
		name: room.name,
		description: room.description,
		price: room.price,
		roomStatus: ROOM_STATUS_VALUE_BY_NAME[room.roomStatus] ?? 1,
		latitude: room.latitude,
		longitude: room.longitude,
		selectedServices,
		policies,
		existingImages: room.images ?? [],
	};
}
