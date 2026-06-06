import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RoleEnum } from "../../../global/enum/role";
import type { User } from "../types/user";

interface AuthState {
	user: User | null;
	accessToken: string;
	refreshToken: string;
	activeRole: RoleEnum | null;
	actions: AuthActions;
}

interface AuthActions {
	setUser: (user: User) => void;
	setAccessToken: (accessToken: string) => void;
	setRefreshToken: (refreshToken: string) => void;
	setActiveRole: (role: RoleEnum | null) => void;

	clearAll: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			accessToken: "",
			refreshToken: "",
			activeRole: null,

			actions: {
				setUser: (user) => set({ user }),
				setAccessToken: (accessToken) => set({ accessToken }),
				setRefreshToken: (refreshToken) => set({ refreshToken }),
				setActiveRole: (activeRole) => set({ activeRole }),
				clearAll() {
					set({
						user: null,
						accessToken: "",
						refreshToken: "",
						activeRole: null,
					});
				},
			},
		}),
		{
			name: "authStore",
			partialize: (state) => ({
				accessToken: state.accessToken,
				refreshToken: state.refreshToken,
				activeRole: state.activeRole,
			}),
		},
	),
);

export const useUser = () => useAuthStore((state) => state.user);
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
export const useRefreshToken = () =>
	useAuthStore((state) => state.refreshToken);
export const useActiveRole = () => useAuthStore((state) => state.activeRole);
export const useAuthActions = () => useAuthStore((state) => state.actions);
