export interface BookingDto {
	id: number;
	bookerId: string;
	bookerName: string;
	bookerEmail: string;
	bookingStatus: string;
	roomId: number;
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
	bookings: BookingDto[];
}
