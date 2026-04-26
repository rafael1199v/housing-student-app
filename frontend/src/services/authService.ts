import type { AuthResponse } from "../features/auth/types/authResponse";
import type { LoginRequest } from "../features/auth/types/loginRequest";
import type { RegisterDto } from "../features/auth/types/registerDto";
import type { ChangePasswordDto } from "../features/profile-settings/types/changePasswordDto";
import type { UpdateUserDataDto } from "../features/profile-settings/types/updateUserDataDto";
import type { UserDataDto } from "../features/profile-settings/types/userDataDto";
import { api } from "./apiService";

const authService = {
	login: (data: LoginRequest) =>
		api.post<AuthResponse>("/api/login", data, { requiresAuth: false }),
	register: (user: RegisterDto) =>
		api.post<void>("/api/register", user, { requiresAuth: false }),
	getData: () => api.get<UserDataDto>("/api/user/data"),
	updateData: (data: UpdateUserDataDto) =>
		api.put<void>("/api/user/data", data),
	changePassword: (data: ChangePasswordDto) =>
		api.put<void>("/api/user/password", data),
};

export default authService;
