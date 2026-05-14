import { RoleEnum } from "../../../global/enum/role";

interface JwtPayload {
	role?: string;
}

function decodeBase64Url(value: string) {
	const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
	const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
	return atob(padded);
}

export function getRoleFromAccessToken(accessToken: string): RoleEnum | null {
	if (!accessToken) {
		return null;
	}

	const parts = accessToken.split(".");
	if (parts.length < 2) {
		return null;
	}

	try {
		const payloadRaw = decodeBase64Url(parts[1]);
		const payload = JSON.parse(payloadRaw) as JwtPayload;

		if (
			payload.role === RoleEnum.Student ||
			payload.role === RoleEnum.Householder
		) {
			return payload.role;
		}

		return null;
	} catch {
		return null;
	}
}
