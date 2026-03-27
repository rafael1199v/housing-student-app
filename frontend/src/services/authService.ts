import type { AuthResponse } from "../features/auth/types/authResponse";
import type { LoginRequest } from "../features/auth/types/loginRequest";
import type { RegisterDto } from "../features/auth/types/registerDto";
import { api } from "./apiService";

const authService = {
	login: (data: LoginRequest) =>
		api.post<AuthResponse>("/api/login", data, { requiresAuth: false }),
	register: (user: RegisterDto) =>
		api.post<void>("/api/register", user, { requiresAuth: false }),
};

export default authService;
