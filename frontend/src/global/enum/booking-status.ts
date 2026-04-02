export const BookingStatusEnum = {
	Pending: "Pending",
	Confirmed: "Confirmed",
	Rejected: "Cancelled",
} as const;

export type BookingStatusEnum =
	(typeof BookingStatusEnum)[keyof typeof BookingStatusEnum];
