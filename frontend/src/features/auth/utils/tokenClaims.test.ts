import { describe, expect, it } from "vitest";
import { getRoleFromAccessToken } from "./tokenClaims";

const base64Url = (value: string) =>
	btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");

const makeToken = (payload: Record<string, unknown>) => {
	const header = base64Url(JSON.stringify({ alg: "none", typ: "JWT" }));
	const body = base64Url(JSON.stringify(payload));
	return `${header}.${body}.`;
};

describe("getRoleFromAccessToken", () => {
	it("returns null for empty token", () => {
		expect(getRoleFromAccessToken("")).toBeNull();
	});

	it("returns null for malformed token", () => {
		expect(getRoleFromAccessToken("not-a-jwt")).toBeNull();
	});

	it("returns null when role is missing", () => {
		const token = makeToken({ sub: "user" });
		expect(getRoleFromAccessToken(token)).toBeNull();
	});

	it("returns Student for student role (case-insensitive)", () => {
		const token = makeToken({ role: "STUDENT" });
		expect(getRoleFromAccessToken(token)).toBe("Student");
	});

	it("returns Householder for householder role with whitespace", () => {
		const token = makeToken({ role: "  Householder  " });
		expect(getRoleFromAccessToken(token)).toBe("Householder");
	});

	it("returns null for unknown role", () => {
		const token = makeToken({ role: "Admin" });
		expect(getRoleFromAccessToken(token)).toBeNull();
	});
});
