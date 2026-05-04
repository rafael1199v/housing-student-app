export interface CreateRoomDto {
	name: string;
	latitude: number;
	longitude: number;
	description: string;
	price: number;
	roomStatus: number;
	imageRoomFiles: File[];
	services: number[];
	policies: { id: number; description: string }[];
}
