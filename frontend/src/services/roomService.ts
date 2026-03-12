import AxiosInstance from "../apiService";
import type { RoomData } from "../features/home/types/roomDataDto";

const roomService = {
	async getRooms(): Promise<RoomData[]> {
		try {
			await new Promise((resolve) => setTimeout(resolve, 2000));

			const response = await AxiosInstance.get<RoomData[]>(
				"http://localhost:3000/rooms",
			);

			if (response.data === undefined) return [];

			return response.data;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
};

export default roomService;
