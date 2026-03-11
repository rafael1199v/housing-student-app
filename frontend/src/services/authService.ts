// TODO: Añadir servicios y clases para hacer las llamadas a api

import AxiosInstance from "../apiService";
import type { AuthResponse } from "../features/auth/types/authResponse";
import type { LoginRequest } from "../features/auth/types/loginRequest";
import type { RegisterDto } from "../features/auth/types/registerDto";

const authService = {
	async login(data: LoginRequest): Promise<AuthResponse> {
		try {
			const response = await AxiosInstance.post("/api/login", data);
			return response.data;
		} catch (error) {
			console.error("Error during login: ", error);
			throw error;
		}
	},

	async register(user: RegisterDto): Promise<void> {
		try {
			const response = await AxiosInstance.post("/api/register", user);
			console.log(response);
			//return response.data;
		} catch (error) {
			console.error("Error during register:", error);
			throw error;
		}
	},
};

export default authService;
