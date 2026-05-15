import { Navigate, Outlet } from "react-router";
import { useAccessToken } from "../features/auth/store/authStore";
import { getRoleFromAccessToken } from "../features/auth/utils/tokenClaims";

export function HouseholderProtectedRoute() {
	const token = useAccessToken();
	const role = getRoleFromAccessToken(token);

	if (role !== "Householder") {
		return <Navigate to="/forbidden" replace />;
	}

	return <Outlet />;
}
