import { Navigate, Outlet } from "react-router";
import { useAccessToken } from "../features/auth/store/authStore";

/**
 * Wraps routes that should only be accessible to unauthenticated users.
 * Redirects to /index when the user already has an access token.
 */
export default function GuestRoute() {
	const accessToken = useAccessToken();

	if (accessToken) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
}
