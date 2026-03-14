import { Outlet, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuthActions } from "../features/auth/store/authStore";

export function MainLayout() {
	const { clearAll } = useAuthActions();
	const navigate = useNavigate();
	const location = useLocation();

	const handleLogout = () => {
		clearAll();
		toast.success("Sesión cerrada");
		navigate("/login");
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
			<nav className="border-b border-slate-200 bg-white/90 backdrop-blur">
				<div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
					<div className="flex items-center gap-3">
						<div className="rounded-md border border-slate-300 px-2 py-1 text-sm font-semibold text-slate-900">
							Logo
						</div>
						<p className="text-lg font-semibold text-slate-900">App navbar</p>
					</div>

					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={() => navigate("/rooms")}
							className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
								location.pathname === "/rooms"
									? "border-blue-200 bg-blue-50 text-blue-700"
									: "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
							}`}
						>
							Rooms
						</button>
						<button
							type="button"
							onClick={handleLogout}
							className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
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
