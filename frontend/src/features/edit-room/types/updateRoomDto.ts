export interface UpdateRoomDto {
	roomId: string;
	name: string;
	latitude: number;
	longitude: number;
	description: string;
	price: number;
	roomStatus: number;
	imageRoomFiles: File[];
	keptImageIds: number[];
	services: number[];
	policies: { id: number; description: string }[];
}
