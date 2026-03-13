import { Outlet, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { useAuthActions } from "../features/auth/store/authStore";

export function MainLayout() {
	const [searchParams, setSearchParams] = useSearchParams();
	const { clearAll } = useAuthActions();
	const navigate = useNavigate();
	const query = searchParams.get("q") ?? "";

	const handleSearchChange = (value: string) => {
		const nextParams = new URLSearchParams(searchParams);

		if (value.trim()) {
			nextParams.set("q", value);
		} else {
			nextParams.delete("q");
		}

		setSearchParams(nextParams);
	};

	const handleLogout = () => {
		clearAll();
		toast.success("Sesión cerrada");
		navigate("/login");
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
			<nav className="border-b border-slate-200 bg-white/90 backdrop-blur">
				<div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
					<div>
						<p className="text-lg font-semibold text-slate-900">
							Student Housing
						</p>
						<p className="text-xs text-slate-500">Encuentra tu próximo hogar</p>
					</div>

					<div className="flex w-full max-w-md items-center gap-3">
						<input
							type="search"
							value={query}
							onChange={(event) => handleSearchChange(event.target.value)}
							placeholder="Busca por nombre o descripción"
							className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
						/>
						<button
							type="button"
							onClick={handleLogout}
							className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
						>
							Cerrar sesión
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
