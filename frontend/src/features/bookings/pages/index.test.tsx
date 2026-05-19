import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BookingsPage } from "./index";

const navigateMock = vi.fn();
let queryState: {
	isLoading: boolean;
	isError: boolean;
	data?: unknown;
};

vi.mock("react-i18next", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react-i18next")>();
	return {
		...actual,
		useTranslation: () => ({ t: (key: string) => key }),
	};
});

vi.mock("react-router", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react-router")>();
	return {
		...actual,
		useNavigate: () => navigateMock,
	};
});

vi.mock("@tanstack/react-query", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@tanstack/react-query")>();
	return {
		...actual,
		useQuery: () => queryState as unknown,
	};
});

describe("BookingsPage", () => {
	beforeEach(() => {
		navigateMock.mockReset();
		queryState = { isLoading: false, isError: false, data: [] };
	});

	it("shows loading skeletons", () => {
		queryState = { isLoading: true, isError: false, data: undefined };
		const { container } = render(<BookingsPage />);

		expect(container.querySelectorAll(".animate-pulse").length).toBe(3);
	});

	it("shows error state when query fails", () => {
		queryState = { isLoading: false, isError: true, data: undefined };
		render(<BookingsPage />);

		expect(screen.getByText("bookings.loadError")).toBeInTheDocument();
	});

	it("shows empty state when there are no bookings", () => {
		queryState = { isLoading: false, isError: false, data: [] };
		render(<BookingsPage />);

		expect(screen.getByText("bookings.noRooms")).toBeInTheDocument();
		expect(screen.getByText("bookings.noMatch")).toBeInTheDocument();
	});

	it("renders bookings and navigates on card click", () => {
		queryState = {
			isLoading: false,
			isError: false,
			data: [
				{
					id: 1,
					roomId: 10,
					bookingStatus: "Pending",
					bookingStatusId: 1,
					bookingRoomName: "Room A",
				},
				{
					id: 2,
					roomId: 20,
					bookingStatus: "Confirmed",
					bookingStatusId: 2,
					bookingRoomName: "Room B",
				},
			],
		};

		render(<BookingsPage />);

		expect(screen.getByText("Room A")).toBeInTheDocument();
		expect(screen.getByText("Room B")).toBeInTheDocument();

		fireEvent.click(screen.getByText("Room A"));
		expect(navigateMock).toHaveBeenCalledWith("/details/10");
	});
});
