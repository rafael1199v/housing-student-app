import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuthActions } from "../../auth/store/authStore";

export function Footer() {
	const navigate = useNavigate();
	const { clearAll } = useAuthActions();
	const handleLogout = () => {
		clearAll();
		toast.success("Sesión cerrada");
		navigate("/login");
	};
	return (
		<footer className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
							className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100"
						>
							Home
						</button>
						<button
							type="button"
							onClick={() => navigate("/rooms")}
							className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100"
						>
							Rooms
						</button>
						<button
							type="button"
							onClick={handleLogout}
							className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100"
						>
							Log out
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
}
