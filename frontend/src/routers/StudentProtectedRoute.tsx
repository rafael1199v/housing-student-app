import { Navigate, Outlet } from "react-router";
import { useAccessToken } from "../features/auth/store/authStore";
import { getRoleFromAccessToken } from "../features/auth/utils/tokenClaims";
import { RoleEnum } from "../global/enum/role";

export function StudentProtectedRoute() {
	const token = useAccessToken();
	const role = getRoleFromAccessToken(token);

	if (role !== RoleEnum.Student) {
		return <Navigate to="/forbidden" replace />;
	}

	return <Outlet />;
}
