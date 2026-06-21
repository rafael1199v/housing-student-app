export interface BookingDto {
	id: number;
	bookerId: string;
	bookerName: string;
	bookerEmail: string;
	bookerPhoneNumber: string;
	bookingStatus: string;
	roomId: number;
	bookerImageUrl: string;
}

export interface RoomImageInfo {
	id: number;
	url: string;
}

export interface RoomHouseholderDetailDto {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
	description: string;
	price: number;
	roomStatus: string;
	imageRoomUrls: string[];
	images: RoomImageInfo[];
	services: string[];
	policies: RoomPolicyDto[];
	bookings: BookingDto[];
}

export interface RoomPolicyDto {
	code: string;
	description: string;
}
