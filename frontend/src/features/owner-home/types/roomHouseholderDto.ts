export interface RoomHouseholderDto {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
	description: string;
	price: number;
	roomStatus: string;
	bookingRequests: number;
	imageRoomUrls: string[];
}
