// TODO: Añadir servicios y clases para hacer las llamadas a api

import AxiosInstance from "../apiService";

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
};

export default authService;
