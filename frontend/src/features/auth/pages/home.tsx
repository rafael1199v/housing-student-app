import { useAuthActions } from "../store/authStore";

export default function Home() {
	const { clearAll } = useAuthActions();

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
			<div className="w-full max-w-lg bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
				<h1 className="text-3xl font-semibold text-slate-900 mb-2">
					Bienvenido
				</h1>
				<p className="text-slate-500 mb-8">
					Has iniciado sesión correctamente.
				</p>
				<button
					type="button"
					onClick={clearAll}
					className="bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-6 rounded-lg transition duration-200"
				>
					Cerrar sesión
				</button>
			</div>
		</div>
	);
}
