type UserRole = "Student" | "Householder";

interface JwtPayload {
	role?: string;
}

function decodeBase64Url(value: string) {
	const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
	const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
	return atob(padded);
}

export function getRoleFromAccessToken(accessToken: string): UserRole | null {
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

		if (typeof payload.role !== "string") {
			return null;
		}

		const normalizedRole = payload.role.trim().toLowerCase();
		if (normalizedRole === "student") {
			return "Student";
		}

		if (normalizedRole === "householder") {
			return "Householder";
		}

		return null;
	} catch {
		return null;
	}
}
