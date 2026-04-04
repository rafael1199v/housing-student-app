import { toast } from "sonner";
import { useAuthStore } from "../features/auth/store/authStore";
import { router } from "../routers/routes";
export interface RequestOptions extends RequestInit {
	requiresAuth?: boolean;
	baseURL?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

function getToken(): string {
	return useAuthStore.getState().accessToken;
}

export async function apiFetch<T>(
	endpoint: string,
	{
		requiresAuth = true,
		baseURL = API_BASE_URL,
		headers,
		...rest
	}: RequestOptions = {},
): Promise<T> {
	const authHeaders: HeadersInit =
		requiresAuth && getToken() ? { Authorization: `Bearer ${getToken()}` } : {};
	const contentTypeHeaders: HeadersInit =
		rest.body instanceof FormData ? {} : { "Content-Type": "application/json" };

	const response = await fetch(`${baseURL}${endpoint}`, {
		headers: {
			...contentTypeHeaders,
			...authHeaders,
			...headers,
		},
		...rest,
	});

	if (!response.ok) {
		if (response.status === 401) {
			useAuthStore.getState().actions.clearAll();
			router.navigate("/login");
			toast.error("Sesión expirada. Ingresa tus credenciales nuevamente");
			throw new Error("Sesión expirada");
		}

		if (response.status === 403) {
			router.navigate("/not-found");
			throw new Error("forbidden.resource");
		}

		const error = await response
			.json()
			.catch(() => ({ message: response.statusText }));
		throw new Error(error.code ?? `HTTP ${response.status}`);
	}

	if (response.status === 204) return undefined as T;
	return response.json() as Promise<T>;
}

export const api = {
	get: <T>(endpoint: string, opts?: RequestOptions) =>
		apiFetch<T>(endpoint, { method: "GET", ...opts }),
	post: <T>(endpoint: string, body: unknown, opts?: RequestOptions) =>
		apiFetch<T>(endpoint, {
			method: "POST",
			body: JSON.stringify(body),
			...opts,
		}),
	put: <T>(endpoint: string, body: unknown, opts?: RequestOptions) =>
		apiFetch<T>(endpoint, {
			method: "PUT",
			body: JSON.stringify(body),
			...opts,
		}),
	patch: <T>(endpoint: string, body: unknown, opts?: RequestOptions) =>
		apiFetch<T>(endpoint, {
			method: "PATCH",
			body: JSON.stringify(body),
			...opts,
		}),
	delete: <T>(endpoint: string, opts?: RequestOptions) =>
		apiFetch<T>(endpoint, { method: "DELETE", ...opts }),
};
