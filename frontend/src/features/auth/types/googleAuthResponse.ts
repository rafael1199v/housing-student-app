import type { AuthResponse } from "./authResponse";

export interface GoogleAuthResponse {
	isNewUser: boolean;
	credentials: AuthResponse | null;
}
