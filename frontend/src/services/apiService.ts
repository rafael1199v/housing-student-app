import { toast } from "sonner";
import { API_BASE_URL } from "../config/constants";
import { useAuthStore } from "../features/auth/store/authStore";
import { getErrorMessage } from "../locales/errorMessages";
import { router } from "../routers/routes";
import { refreshAccessToken } from "./refreshToken";
export interface RequestOptions extends RequestInit {
	requiresAuth?: boolean;
	baseURL?: string;
	isRetry?: boolean;
}

function getToken(): string {
	return useAuthStore.getState().accessToken;
}

export async function apiFetch<T>(
	endpoint: string,
	{
		requiresAuth = true,
		baseURL = API_BASE_URL,
		headers,
		isRetry = false,
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

	if (response.status === 204) return undefined as T;

	if (response.ok) return response.json() as Promise<T>;

	if (response.status === 401 && requiresAuth && !isRetry) {
		if (!(await refreshAccessToken())) {
			useAuthStore.getState().actions.clearAll();
			router.navigate("/login");
			toast.error("Sesión expirada. Ingresa tus credenciales nuevamente");
			throw new Error("Sesión expirada");
		}

		return apiFetch<T>(endpoint, {
			requiresAuth: requiresAuth,
			baseURL: baseURL,
			headers: headers,
			isRetry: true,
			...rest,
		});
	}

	if (response.status === 403) {
		router.navigate("/not-found");
		throw new Error("forbidden.resource");
	}

	const error = await response
		.json()
		.catch(() => ({ message: response.statusText }));

	const code: string = error.code ?? error[0]?.code;

	throw new Error(
		getErrorMessage(code, error.message ?? error[0]?.errorMessage),
	);
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
