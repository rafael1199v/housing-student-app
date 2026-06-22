import { Navigate, Outlet } from "react-router";
import { useRoles } from "../features/auth/hooks/useRoles";
import { RoleEnum } from "../global/enum/role";

export function StudentProtectedRoute() {
	const { hasRole } = useRoles();

	if (!hasRole(RoleEnum.Student)) {
		return <Navigate to="/forbidden" replace />;
	}

	return <Outlet />;
}
