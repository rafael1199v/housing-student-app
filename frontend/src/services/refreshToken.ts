import { useAuthStore } from "../features/auth/store/authStore";
import type { AuthResponse } from "../features/auth/types/authResponse";
import { baseFetch } from "./baseFetch";

export async function refreshAccessToken(): Promise<boolean> {
	const store = useAuthStore.getState();
	const { refreshToken } = store;

	try {
		const response = await baseFetch("/api/login/refresh-token", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ refreshToken }),
		});

		if (!response.ok) {
			return false;
		}

		const authData = (await response.json()) as AuthResponse;

		store.actions.setAccessToken(authData.accessToken);
		store.actions.setRefreshToken(authData.refreshToken);

		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}
