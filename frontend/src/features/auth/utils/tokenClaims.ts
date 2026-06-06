import { ROLE_PRIORITY, RoleEnum } from "../../../global/enum/role";

interface JwtPayload {
	role?: string | string[];
}

const KNOWN_ROLES = Object.values(RoleEnum) as RoleEnum[];

function decodeBase64Url(value: string) {
	const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
	const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
	return atob(padded);
}

function isKnownRole(value: string): value is RoleEnum {
	return (KNOWN_ROLES as string[]).includes(value);
}

export function getRolesFromAccessToken(accessToken: string): RoleEnum[] {
	if (!accessToken) {
		return [];
	}

	const parts = accessToken.split(".");
	if (parts.length < 2) {
		return [];
	}

	try {
		const payload = JSON.parse(decodeBase64Url(parts[1])) as JwtPayload;
		const raw = payload.role;
		const list = Array.isArray(raw) ? raw : raw != null ? [raw] : [];
		return list.filter(isKnownRole);
	} catch {
		return [];
	}
}

export function hasRole(accessToken: string, role: RoleEnum): boolean {
	return getRolesFromAccessToken(accessToken).includes(role);
}

export function getActiveRole(
	accessToken: string,
	preferred: RoleEnum | null,
): RoleEnum | null {
	const roles = getRolesFromAccessToken(accessToken);
	if (roles.length === 0) {
		return null;
	}

	if (preferred && roles.includes(preferred)) {
		return preferred;
	}

	return roles.reduce(
		(best, role) => (ROLE_PRIORITY[role] > ROLE_PRIORITY[best] ? role : best),
		roles[0],
	);
}

export function getRoleFromAccessToken(accessToken: string): RoleEnum | null {
	return getActiveRole(accessToken, null);
}
