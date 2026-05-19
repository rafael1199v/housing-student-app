import type { AuthResponse } from "../features/auth/types/authResponse";
import type { ConfirmEmailRequest } from "../features/auth/types/confirmEmailRequest";
import type { GoogleAuthResponse } from "../features/auth/types/googleAuthResponse";
import type { LoginRequest } from "../features/auth/types/loginRequest";
import type { LoginWithGoogleRequest } from "../features/auth/types/loginWithGoogleRequest";
import type { RegisterDto } from "../features/auth/types/registerDto";
import type { RegisterGoogleRequest } from "../features/auth/types/registerGoogleRequest";
import type { UpdateUserDataDto } from "../features/profile-settings/types/updateUserDataDto";
import type { UserDataDto } from "../features/profile-settings/types/userDataDto";
import { api } from "./apiService";

export const authService = {
	login: (data: LoginRequest) =>
		api.post<AuthResponse>("/api/login", data, { requiresAuth: false }),
	register: (user: RegisterDto) =>
		api.post<void>("/api/register", user, { requiresAuth: false }),
	getData: () => api.get<UserDataDto>("/api/user"),
	updateData: (data: Partial<UpdateUserDataDto>) =>
		api.put<void>("/api/user", data),
	googleLogin: (data: LoginWithGoogleRequest) =>
		api.post<GoogleAuthResponse>("/api/login/google", data, {
			requiresAuth: false,
		}),
	googleRegister: (data: RegisterGoogleRequest) =>
		api.post<AuthResponse>("/api/register/google", data, {
			requiresAuth: false,
		}),
	confirmEmail: (data: ConfirmEmailRequest) =>
		api.patch<void>("/api/auth/confirm-email", data, {
			requiresAuth: false,
		}),
	logout: () => api.delete<void>("/api/auth/logout"),
};
