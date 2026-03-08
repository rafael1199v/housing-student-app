// TODO: Añadir servicios y clases para hacer las llamadas a api

import AxiosInstance from "../apiService";
import type { RegisterDto } from "../features/auth/types/registerDto";

const authService = {
	login: async (username: string, password: string) => {
		try {
			const response = await AxiosInstance.post("/auth/login", {
				username,
				password,
			});
			return response.data;
		} catch (error) {
			console.error("Error during login:", error);
			throw error;
		}
	},
	register: async (user: RegisterDto) => {
		try {
			const response = await AxiosInstance.post("/auth/register", user);
			return response.data;
		} catch (error) {
			console.error("Error during register:", error);
			throw error;
		}
	},
};

export default authService;
