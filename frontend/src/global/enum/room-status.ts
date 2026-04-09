export const RoomStatusEnum = {
	Available: "Available",
	Unavailable: "Unavailable",
	Booked: "Booked",
} as const;

export type RoomStatusEnum =
	(typeof RoomStatusEnum)[keyof typeof RoomStatusEnum];
