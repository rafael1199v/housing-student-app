import { toast } from "sonner";
import { useAuthStore } from "../features/auth/store/authStore";
import i18n from "../i18n";
import { router } from "../routers/routes";
export interface RequestOptions extends RequestInit {
	requiresAuth?: boolean;
	baseURL?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

function getToken(): string {
	return useAuthStore.getState().accessToken;
}

function translateError(code: string | undefined): string {
	if (!code) return i18n.t("errors:fallback", { ns: "errors" });
	const key = code.replace(/\./g, "_");
	return i18n.t(key, {
		ns: "errors",
		defaultValue: i18n.t("errors:fallback", { ns: "errors" }),
	});
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

	try {
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
				toast.error(i18n.t("auth.login.sessionExpired"));
				throw new Error(i18n.t("auth.login.sessionExpired"));
			}

			if (response.status === 403) {
				router.navigate("/not-found");
				throw new Error("forbidden.resource");
			}

			const error = await response.json().catch(() => ({ code: undefined }));

			const code: string = error.code ?? error[0]?.code;
			throw new Error(translateError(code));
		}

		if (response.status === 204) return undefined as T;
		return response.json() as Promise<T>;
	} catch {
		throw new Error(i18n.t("unknown_error", { ns: "errors" }));
	}
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
