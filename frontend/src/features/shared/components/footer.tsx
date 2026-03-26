import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAccessToken, useAuthActions } from "../../auth/store/authStore";
import { getRoleFromAccessToken } from "../../auth/utils/tokenClaims";

export function Footer() {
	const navigate = useNavigate();
	const { clearAll } = useAuthActions();
	const token = useAccessToken();
	const role = getRoleFromAccessToken(token);
	const handleLogout = () => {
		clearAll();
		toast.success("Sesión cerrada");
		navigate("/login");
	};
	return (
		<footer className="rounded-2xl bg-surface-container-low p-6 shadow-sm">
			<h3 className="text-lg font-semibold text-slate-900">Footer</h3>
			<div className="mt-4 grid gap-6 md:grid-cols-2">
				<div>
					<p className="text-sm font-medium text-slate-700">
						Contact information
					</p>
					<p className="mt-2 text-sm text-slate-600">
						Email: contact@studenthousing.app
					</p>
					<p className="text-sm text-slate-600">Phone: +591 70000000</p>
				</div>
				<div>
					<p className="text-sm font-medium text-slate-700">Pages</p>
					<div className="mt-2 flex flex-wrap gap-2">
						<button
							type="button"
							onClick={() => navigate("/")}
							className="rounded-full bg-surface-container-high px-3 py-1.5 text-sm text-slate-700 transition hover:bg-surface-container"
						>
							Home
						</button>
						{role === "Student" ? (
							<>
								<button
									type="button"
									onClick={() => navigate("/rooms")}
									className="rounded-full bg-surface-container-high px-3 py-1.5 text-sm text-slate-700 transition hover:bg-surface-container"
								>
									Rooms
								</button>
								<button
									type="button"
									onClick={() => navigate("/bookings")}
									className="rounded-full bg-surface-container-high px-3 py-1.5 text-sm text-slate-700 transition hover:bg-surface-container"
								>
									Booked rooms
								</button>
							</>
						) : (
							<button
								type="button"
								onClick={() => navigate("/owner/rooms/new")}
								className="rounded-full bg-surface-container-high px-3 py-1.5 text-sm text-slate-700 transition hover:bg-surface-container"
							>
								Create new room
							</button>
						)}
						<button
							type="button"
							onClick={handleLogout}
							className="rounded-full bg-secondary-fixed px-3 py-1.5 text-sm text-on-secondary-fixed transition hover:brightness-95"
						>
							Log out
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
}
