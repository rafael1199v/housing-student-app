import { useMutation } from "@tanstack/react-query";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import authService from "../../../services/authService";
import type { AuthResponse } from "../types/authResponse";
import type { LoginRequest } from "../types/loginRequest";
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

const useAuthStore = create<AuthState>()(
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
		{ name: "authStore" },
	),
);

export const useUser = () => useAuthStore((state) => state.user);
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
export const useRefreshToken = () =>
	useAuthStore((state) => state.refreshToken);
export const useAuthActions = () => useAuthStore((state) => state.actions);

export const useSignIn = () => {
	const { setAccessToken } = useAuthActions();

	const signInMutation = useMutation({
		mutationFn: authService.login,
	});

	const signIn = async (data: LoginRequest) => {
		try {
			const response: AuthResponse = await signInMutation.mutateAsync(data);
			console.log(response);
			const { accessToken } = response;
			setAccessToken(accessToken);
		} catch (e) {
			console.error(e);
			throw e;
		}
	};

	return signIn;
};
