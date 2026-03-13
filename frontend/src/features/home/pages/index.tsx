import { useQuery } from "@tanstack/react-query";
// import { useSearchParams } from "react-router";
import roomService from "../../../services/roomService";
import { Card } from "../components/cards";
import { CardSkeleton } from "../components/skeleton";

export function HomePage() {
	// const [searchParams] = useSearchParams();
	// const query = (searchParams.get("q") ?? "").toLowerCase().trim();

	const { isLoading, isError, data } = useQuery({
		queryKey: ["rooms"],
		queryFn: roomService.getRooms,
	});

	const rooms = data ?? [];

	const averagePrice =
		rooms.length > 0
			? Math.round(
					rooms.reduce((sum, room) => sum + room.price, 0) / rooms.length,
				)
			: 0;

	const formattedAveragePrice = new Intl.NumberFormat("es-BO").format(
		averagePrice,
	);

	return (
		<div className="space-y-8">
			<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				<h1 className="text-3xl font-semibold text-slate-900">
					Tu plataforma de vivienda estudiantil
				</h1>
				<p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
					Descubre habitaciones y apartamentos pensados para estudiantes, con
					opciones accesibles y ubicaciones convenientes para tu vida académica.
				</p>

				<div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
					<div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
						<p className="text-xs font-medium uppercase tracking-wide text-slate-500">
							Alojamientos publicados
						</p>
						<p className="mt-1 text-2xl font-semibold text-slate-900">
							{rooms.length}
						</p>
					</div>
					<div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
						<p className="text-xs font-medium uppercase tracking-wide text-slate-500">
							Precio promedio
						</p>
						<p className="mt-1 text-2xl font-semibold text-slate-900">
							${formattedAveragePrice}
						</p>
					</div>
					<div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
						<p className="text-xs font-medium uppercase tracking-wide text-slate-500">
							Resultados actuales
						</p>
						<p className="mt-1 text-2xl font-semibold text-slate-900">
							{isLoading ? "..." : rooms.length}
						</p>
					</div>
				</div>
			</section>

			<section className="space-y-4">
				<div>
					<h2 className="text-xl font-semibold text-slate-900">
						Alojamientos disponibles
					</h2>
					<p className="text-sm text-slate-500">
						Usa el buscador de la barra superior para filtrar por nombre o
						descripción.
					</p>
				</div>

				{isLoading ? (
					<CardSkeleton quantity={3} />
				) : rooms.length === 0 ? (
					<div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
						No hay resultados para tu búsqueda. Prueba con otros términos.
					</div>
				) : isError ? (
					<div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-red-700">
						No pudimos cargar los alojamientos. Inténtalo de nuevo más tarde.
					</div>
				) : (
					<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
						{rooms.map((room) => (
							<Card
								key={room.id}
								name={room.name}
								price={room.price}
								description={room.description}
								imageUrl={room.imageUrl}
							/>
						))}
					</div>
				)}
			</section>
		</div>
	);
}
