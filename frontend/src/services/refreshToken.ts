import { API_BASE_URL } from "../config/constants";
import { useAuthStore } from "../features/auth/store/authStore";
import type { AuthResponse } from "../features/auth/types/authResponse";

export async function refreshAccessToken(): Promise<boolean> {
	const refreshToken: string = useAuthStore.getState().refreshToken;

	try {
		const response = await fetch(`${API_BASE_URL}/api/login/refresh-token`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				refreshToken: refreshToken,
			}),
		});

		if (!response.ok) {
			return false;
		}

		const authData = (await response.json()) as AuthResponse;

		useAuthStore.getState().actions.setAccessToken(authData.accessToken);
		useAuthStore.getState().actions.setRefreshToken(authData.refreshToken);

		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}
