import { useEffect, useMemo } from "react";
import type { RoleEnum } from "../../../global/enum/role";
import {
	useAccessToken,
	useActiveRole,
	useAuthActions,
} from "../store/authStore";
import { getActiveRole, getRolesFromAccessToken } from "../utils/tokenClaims";

export function useRoles() {
	const token = useAccessToken();
	const storedActiveRole = useActiveRole();
	const { setActiveRole } = useAuthActions();

	const heldRoles = useMemo(() => getRolesFromAccessToken(token), [token]);

	const activeRole = useMemo(
		() => getActiveRole(token, storedActiveRole),
		[token, storedActiveRole],
	);

	useEffect(() => {
		if (activeRole !== storedActiveRole) {
			setActiveRole(activeRole);
		}
	}, [activeRole, storedActiveRole, setActiveRole]);

	const hasRole = (role: RoleEnum) => heldRoles.includes(role);

	return { heldRoles, activeRole, hasRole, setActiveRole };
}
