export const RoleEnum = {
	Student: "Student",
	Householder: "Householder",
} as const;

export type RoleEnum = (typeof RoleEnum)[keyof typeof RoleEnum];

// Frontend-only display/default preference for picking the active role when a user
// holds several (see getActiveRole). NOT a mirror of the backend RoleHierarchy ranks:
// there Student and Householder are equal-rank peers that can be freely exchanged.
export const ROLE_PRIORITY: Record<RoleEnum, number> = {
	[RoleEnum.Householder]: 2,
	[RoleEnum.Student]: 1,
};
