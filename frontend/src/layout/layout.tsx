import { Outlet, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import {
	useAccessToken,
	useAuthActions,
} from "../features/auth/store/authStore";
import { getRoleFromAccessToken } from "../features/auth/utils/tokenClaims";

export function MainLayout() {
	const { clearAll } = useAuthActions();
	const navigate = useNavigate();
	const location = useLocation();
	const token = useAccessToken();
	const role = getRoleFromAccessToken(token);

	const handleLogout = () => {
		clearAll();
		toast.success("Sesión cerrada");
		navigate("/login");
	};

	return (
		<div className="min-h-screen bg-surface">
			<nav className="glass-surface sticky top-0 z-30">
				<div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
					<div className="flex items-center gap-3">
						{/* <div
							className="cursor-pointer rounded-full bg-surface-container-high px-3 py-1 text-sm font-semibold text-slate-900"
							onClick={() => navigate("/")}
						>
							Logo
						</div> */}
						<p
							className="cursor-pointer text-lg font-semibold text-slate-900"
							onClick={() => navigate("/")}
						>
							Itersapiens
						</p>
					</div>

					<div className="flex items-center gap-3">
						{role == "Student" ? (
							<>
								<button
									type="button"
									onClick={() => navigate("/rooms")}
									className={`rounded-full px-4 py-2 text-sm font-medium transition ${
										location.pathname === "/rooms"
											? "bg-primary text-on-primary"
											: "bg-surface-container-high text-slate-700 hover:bg-surface-container"
									}`}
								>
									Rooms
								</button>
								<button
									type="button"
									onClick={() => navigate("/bookings")}
									className={`rounded-full px-4 py-2 text-sm font-medium transition ${
										location.pathname === "/bookings"
											? "bg-primary text-on-primary"
											: "bg-surface-container-high text-slate-700 hover:bg-surface-container"
									}`}
								>
									Booked rooms
								</button>
							</>
						) : (
							<button
								type="button"
								onClick={() => navigate("/owner/rooms/new")}
								className={`rounded-full px-4 py-2 text-sm font-medium transition ${
									location.pathname === "/owner/rooms/new"
										? "bg-primary text-on-primary"
										: "bg-surface-container-high text-slate-700 hover:bg-surface-container"
								}`}
							>
								Create new Room
							</button>
						)}
						<button
							type="button"
							onClick={handleLogout}
							className="rounded-full bg-secondary-fixed px-4 py-2 text-sm font-medium text-on-secondary-fixed transition hover:brightness-95"
						>
							Log out
						</button>
					</div>
				</div>
			</nav>

			<main className="mx-auto w-full max-w-6xl px-4 py-8">
				<Outlet />
			</main>
		</div>
	);
}
