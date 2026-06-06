import { describe, expect, it } from "vitest";
import { RoleEnum } from "../../../global/enum/role";
import {
	getActiveRole,
	getRoleFromAccessToken,
	getRolesFromAccessToken,
	hasRole,
} from "./tokenClaims";

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

	it("returns Student for exact-case role", () => {
		const token = makeToken({ role: "Student" });
		expect(getRoleFromAccessToken(token)).toBe("Student");
	});

	it("returns Householder for exact-case role", () => {
		const token = makeToken({ role: "Householder" });
		expect(getRoleFromAccessToken(token)).toBe("Householder");
	});

	it("returns null for role with wrong case", () => {
		const token = makeToken({ role: "STUDENT" });
		expect(getRoleFromAccessToken(token)).toBeNull();
	});

	it("returns null for role with whitespace", () => {
		const token = makeToken({ role: "  Householder  " });
		expect(getRoleFromAccessToken(token)).toBeNull();
	});

	it("returns null for unknown role", () => {
		const token = makeToken({ role: "Admin" });
		expect(getRoleFromAccessToken(token)).toBeNull();
	});

	it("returns the highest-priority role when the claim is an array", () => {
		const token = makeToken({ role: ["Student", "Householder"] });
		expect(getRoleFromAccessToken(token)).toBe(RoleEnum.Householder);
	});
});

describe("getRolesFromAccessToken", () => {
	it("normalizes a single string role to an array", () => {
		const token = makeToken({ role: "Student" });
		expect(getRolesFromAccessToken(token)).toEqual([RoleEnum.Student]);
	});

	it("returns all roles when the claim is an array", () => {
		const token = makeToken({ role: ["Householder", "Student"] });
		expect(getRolesFromAccessToken(token)).toEqual([
			RoleEnum.Householder,
			RoleEnum.Student,
		]);
	});

	it("filters out unknown roles", () => {
		const token = makeToken({ role: ["Admin", "Student"] });
		expect(getRolesFromAccessToken(token)).toEqual([RoleEnum.Student]);
	});

	it("returns an empty array for an invalid token", () => {
		expect(getRolesFromAccessToken("not-a-jwt")).toEqual([]);
	});
});

describe("hasRole", () => {
	it("is true for every held role and false otherwise", () => {
		const token = makeToken({ role: ["Householder", "Student"] });
		expect(hasRole(token, RoleEnum.Student)).toBe(true);
		expect(hasRole(token, RoleEnum.Householder)).toBe(true);

		const studentOnly = makeToken({ role: "Student" });
		expect(hasRole(studentOnly, RoleEnum.Householder)).toBe(false);
	});
});

describe("getActiveRole", () => {
	it("keeps the preferred role when it is still held", () => {
		const token = makeToken({ role: ["Householder", "Student"] });
		expect(getActiveRole(token, RoleEnum.Student)).toBe(RoleEnum.Student);
	});

	it("falls back to the highest-priority role when the preferred is not held", () => {
		const token = makeToken({ role: ["Householder", "Student"] });
		expect(getActiveRole(token, null)).toBe(RoleEnum.Householder);
	});

	it("returns null when no known role is held", () => {
		const token = makeToken({ role: "Admin" });
		expect(getActiveRole(token, null)).toBeNull();
	});
});
