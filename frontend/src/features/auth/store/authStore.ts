import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/user";

interface AuthState {
	user: User | null;
	accessToken: string;
	refreshToken: string;
	actions: AuthActions;
}

interface AuthActions {
	setUser: (user: User) => void;
	setAccessToken: (accessToken: string) => void;
	setRefreshToken: (refreshToken: string) => void;

	clearAll: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			accessToken: "",
			refreshToken: "",

			actions: {
				setUser: (user) => set({ user }),
				setAccessToken: (accessToken) => set({ accessToken }),
				setRefreshToken: (refreshToken) => set({ refreshToken }),
				clearAll() {
					set({ user: null, accessToken: "", refreshToken: "" });
				},
			},
		}),
		{
			name: "authStore",
			partialize: (state) => ({
				accessToken: state.accessToken,
				refreshToken: state.refreshToken,
			}),
		},
	),
);

export const useUser = () => useAuthStore((state) => state.user);
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
export const useRefreshToken = () =>
	useAuthStore((state) => state.refreshToken);
export const useAuthActions = () => useAuthStore((state) => state.actions);
