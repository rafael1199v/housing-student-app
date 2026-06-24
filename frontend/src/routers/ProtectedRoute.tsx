import { Navigate, Outlet } from "react-router";
import { useAccessToken } from "../features/auth/store/authStore";
import { ChatRealtimeProvider } from "../features/chat/realtime/ChatRealtimeProvider";

/**
 * Wraps routes that require authentication.
 * Redirects to /login when there is no access token.
 */
export default function ProtectedRoute() {
	const accessToken = useAccessToken(); //TODO: Validar payload y rol de hacer falta

	if (!accessToken) {
		return <Navigate to="/login" replace />;
	}

	return (
		<ChatRealtimeProvider>
			<Outlet />
		</ChatRealtimeProvider>
	);
}
