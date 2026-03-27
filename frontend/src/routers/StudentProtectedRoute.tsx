import { Navigate, Outlet } from "react-router";
import { useAccessToken } from "../features/auth/store/authStore";
import { getRoleFromAccessToken } from "../features/auth/utils/tokenClaims";

export function StudentProtectedRoute() {
	const token = useAccessToken();
	const role = getRoleFromAccessToken(token);

	if (role !== "Student") {
		return <Navigate to="/not-found" replace />;
	}

	return <Outlet />;
}
