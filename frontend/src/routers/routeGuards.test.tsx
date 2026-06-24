import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RoleEnum } from "../global/enum/role";
import GuestRoute from "./GuestRoute";
import { HouseholderProtectedRoute } from "./HouseholderProtectedRoute";
import ProtectedRoute from "./ProtectedRoute";
import { StudentProtectedRoute } from "./StudentProtectedRoute";

let accessToken = "";
let heldRoles: RoleEnum[] = [];

vi.mock("../features/auth/store/authStore", () => ({
	useAccessToken: () => accessToken,
}));

vi.mock("../features/auth/hooks/useRoles", () => ({
	useRoles: () => ({
		heldRoles,
		activeRole: heldRoles[0] ?? null,
		hasRole: (role: RoleEnum) => heldRoles.includes(role),
		setActiveRole: vi.fn(),
	}),
}));

vi.mock("../features/chat/realtime/ChatRealtimeProvider", () => ({
	ChatRealtimeProvider: ({ children }: { children: ReactNode }) => children,
}));

beforeEach(() => {
	accessToken = "";
	heldRoles = [];
});

describe("ProtectedRoute", () => {
	it("redirects to /login when unauthenticated", () => {
		render(
			<MemoryRouter initialEntries={["/"]}>
				<Routes>
					<Route element={<ProtectedRoute />}>
						<Route path="/" element={<div>Protected</div>} />
					</Route>
					<Route path="/login" element={<div>Login</div>} />
				</Routes>
			</MemoryRouter>,
		);

		expect(screen.getByText("Login")).toBeInTheDocument();
	});

	it("renders children when authenticated", () => {
		accessToken = "token";

		render(
			<MemoryRouter initialEntries={["/"]}>
				<Routes>
					<Route element={<ProtectedRoute />}>
						<Route path="/" element={<div>Protected</div>} />
					</Route>
					<Route path="/login" element={<div>Login</div>} />
				</Routes>
			</MemoryRouter>,
		);

		expect(screen.getByText("Protected")).toBeInTheDocument();
	});
});

describe("GuestRoute", () => {
	it("renders children when unauthenticated", () => {
		render(
			<MemoryRouter initialEntries={["/login"]}>
				<Routes>
					<Route element={<GuestRoute />}>
						<Route path="/login" element={<div>Login</div>} />
					</Route>
					<Route path="/" element={<div>Home</div>} />
				</Routes>
			</MemoryRouter>,
		);

		expect(screen.getAllByText("Login")[0]).toBeInTheDocument();
	});

	it("redirects to / when authenticated", () => {
		accessToken = "token";

		render(
			<MemoryRouter initialEntries={["/login"]}>
				<Routes>
					<Route element={<GuestRoute />}>
						<Route path="/login" element={<div>Login</div>} />
					</Route>
					<Route path="/" element={<div>Home</div>} />
				</Routes>
			</MemoryRouter>,
		);

		expect(screen.getByText("Home")).toBeInTheDocument();
	});
});

describe("StudentProtectedRoute", () => {
	it("renders children when the user holds the Student role", () => {
		accessToken = "token";
		heldRoles = [RoleEnum.Student];

		render(
			<MemoryRouter initialEntries={["/student"]}>
				<Routes>
					<Route element={<StudentProtectedRoute />}>
						<Route path="/student" element={<div>Student</div>} />
					</Route>
					<Route path="/forbidden" element={<div>Forbidden</div>} />
				</Routes>
			</MemoryRouter>,
		);

		expect(screen.getByText("Student")).toBeInTheDocument();
	});

	it("redirects to /forbidden when the user does not hold the Student role", () => {
		accessToken = "token";
		heldRoles = [RoleEnum.Householder];

		render(
			<MemoryRouter initialEntries={["/student"]}>
				<Routes>
					<Route element={<StudentProtectedRoute />}>
						<Route path="/student" element={<div>Student</div>} />
					</Route>
					<Route path="/forbidden" element={<div>Forbidden</div>} />
				</Routes>
			</MemoryRouter>,
		);

		expect(screen.getByText("Forbidden")).toBeInTheDocument();
	});
});

describe("HouseholderProtectedRoute", () => {
	it("renders children when the user holds the Householder role", () => {
		accessToken = "token";
		heldRoles = [RoleEnum.Householder];

		render(
			<MemoryRouter initialEntries={["/owner"]}>
				<Routes>
					<Route element={<HouseholderProtectedRoute />}>
						<Route path="/owner" element={<div>Owner</div>} />
					</Route>
					<Route path="/forbidden" element={<div>Forbidden</div>} />
				</Routes>
			</MemoryRouter>,
		);

		expect(screen.getByText("Owner")).toBeInTheDocument();
	});

	it("redirects to /forbidden when the user does not hold the Householder role", () => {
		accessToken = "token";
		heldRoles = [RoleEnum.Student];

		render(
			<MemoryRouter initialEntries={["/owner"]}>
				<Routes>
					<Route element={<HouseholderProtectedRoute />}>
						<Route path="/owner" element={<div>Owner</div>} />
					</Route>
					<Route path="/forbidden" element={<div>Forbidden</div>} />
				</Routes>
			</MemoryRouter>,
		);

		expect(screen.getAllByText("Forbidden")[0]).toBeInTheDocument();
	});
});

describe("Multi-role access", () => {
	it("a user holding both roles passes both guards", () => {
		accessToken = "token";
		heldRoles = [RoleEnum.Householder, RoleEnum.Student];

		render(
			<MemoryRouter initialEntries={["/student"]}>
				<Routes>
					<Route element={<StudentProtectedRoute />}>
						<Route path="/student" element={<div>DualStudentArea</div>} />
					</Route>
					<Route element={<HouseholderProtectedRoute />}>
						<Route path="/owner" element={<div>DualOwnerArea</div>} />
					</Route>
					<Route path="/forbidden" element={<div>Forbidden</div>} />
				</Routes>
			</MemoryRouter>,
		);

		expect(screen.getByText("DualStudentArea")).toBeInTheDocument();
	});
});
