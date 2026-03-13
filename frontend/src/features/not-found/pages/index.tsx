import { useNavigate } from "react-router";

export function NotFoundPage() {
	const navigate = useNavigate();
	return (
		<div className="space-y-8">
			<div className="flex flex-wrap justify-center origin-center h-dvh content-center">
				<section className="rounded-2xl border border-slate-200 bg-white p-3 md:p-6 m-3 md:m-0 shadow-sm text-center h-min space-y-4">
					<h1 className="text-7xl font-bold">Oops!🤷‍♂️</h1>
					<h1 className="text-3xl font-semibold text-slate-900">
						Página no encontrada (404)
					</h1>
					<p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-900">
						Parece que la página que buscas no existe. Regrese al inicio y
						vuelva a intentar su búsqueda.
					</p>
					<button
						type="button"
						onClick={() => navigate("/")}
						className="shrink-0 rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
					>
						Volver al inicio
					</button>
				</section>
			</div>
		</div>
	);
}
