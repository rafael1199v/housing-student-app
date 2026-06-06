export const RoleEnum = {
	Student: "Student",
	Householder: "Householder",
} as const;

export type RoleEnum = (typeof RoleEnum)[keyof typeof RoleEnum];

// Keep in sync with the backend RoleHierarchy.
export const ROLE_PRIORITY: Record<RoleEnum, number> = {
	[RoleEnum.Householder]: 2,
	[RoleEnum.Student]: 1,
};
