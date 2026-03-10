// TODO: Añadir servicios y clases para hacer las llamadas a api

import AxiosInstance from "../apiService";
import type { RegisterDto } from "../features/auth/types/registerDto";

const authService = {
	login: async (email: string, password: string) => {
		try {
			const response = await AxiosInstance.post("/api/login", {
				email,
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
			const response = await AxiosInstance.post("/api/register", user);
			return response.data;
		} catch (error) {
			console.error("Error during register:", error);
			throw error;
		}
	},
};

export default authService;
