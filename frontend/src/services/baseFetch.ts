import { API_BASE_URL } from "../config/constants";

export function baseFetch(path: string, init?: RequestInit): Promise<Response> {
	return fetch(`${API_BASE_URL}${path}`, init);
}
