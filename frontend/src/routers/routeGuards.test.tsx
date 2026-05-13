import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GuestRoute from "./GuestRoute";
import { HouseholderProtectedRoute } from "./HouseholderProtectedRoute";
import ProtectedRoute from "./ProtectedRoute";
import { StudentProtectedRoute } from "./StudentProtectedRoute";

let accessToken = "";
let role: "Student" | "Householder" | null = null;

vi.mock("../features/auth/store/authStore", () => ({
	useAccessToken: () => accessToken,
}));

vi.mock("../features/auth/utils/tokenClaims", () => ({
	getRoleFromAccessToken: () => role,
}));

beforeEach(() => {
	accessToken = "";
	role = null;
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
	it("renders children when role is Student", () => {
		accessToken = "token";
		role = "Student";

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

	it("redirects to /not-found when role is not Student", () => {
		accessToken = "token";
		role = "Householder";

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
	it("renders children when role is Householder", () => {
		accessToken = "token";
		role = "Householder";

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

	it("redirects to /not-found when role is not Householder", () => {
		accessToken = "token";
		role = "Student";

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
