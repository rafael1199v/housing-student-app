export const RoleEnum = {
	Student: "Student",
	Householder: "Householder",
} as const;

export type RoleEnum = (typeof RoleEnum)[keyof typeof RoleEnum];
