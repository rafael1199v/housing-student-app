import { API_BASE_URL } from "../config/constants";
import { useAuthStore } from "../features/auth/store/authStore";
import i18n from "../i18n";
import { router } from "../routers/routes";
import { refreshAccessToken } from "./refreshToken";

export interface RequestOptions extends RequestInit {
	requiresAuth?: boolean;
	baseURL?: string;
	/** Pass an AbortSignal via this field (inherited from RequestInit) to cancel in-flight requests. */
	signal?: AbortSignal;
}

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

function serializeBody(body: unknown): BodyInit {
	if (body instanceof FormData) return body;
	return JSON.stringify(body);
}

async function apiFetch<T>(
	endpoint: string,
	options: RequestOptions = {},
	isRetry = false,
): Promise<T> {
	const {
		requiresAuth = true,
		baseURL = API_BASE_URL,
		headers,
		...rest
	} = options;

	const token = getToken();
	const authHeaders: HeadersInit =
		requiresAuth && token ? { Authorization: `Bearer ${token}` } : {};
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
			throw new Error(i18n.t("auth.login.sessionExpired"));
		}

		return apiFetch<T>(endpoint, options, true);
	}

	if (response.status === 403) {
		router.navigate("/forbidden");
		throw new Error("forbidden.resource");
	}

	const error = await response
		.json()
		.catch(() => ({ message: response.statusText }));

	const code: string | undefined = error.code ?? error[0]?.code;

	throw new Error(translateError(code));
}

export const api = {
	get: <T>(endpoint: string, opts?: RequestOptions) =>
		apiFetch<T>(endpoint, { method: "GET", ...opts }),
	post: <T>(endpoint: string, body: unknown, opts?: RequestOptions) =>
		apiFetch<T>(endpoint, {
			method: "POST",
			body: serializeBody(body),
			...opts,
		}),
	put: <T>(endpoint: string, body: unknown, opts?: RequestOptions) =>
		apiFetch<T>(endpoint, {
			method: "PUT",
			body: serializeBody(body),
			...opts,
		}),
	patch: <T>(endpoint: string, body: unknown, opts?: RequestOptions) =>
		apiFetch<T>(endpoint, {
			method: "PATCH",
			body: serializeBody(body),
			...opts,
		}),
	delete: <T>(endpoint: string, opts?: RequestOptions) =>
		apiFetch<T>(endpoint, { method: "DELETE", ...opts }),
};
