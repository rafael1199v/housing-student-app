import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import bookingService from "../../../services/bookingService";
import { Footer } from "../../shared/components/footer";
import { BookingCard } from "../components/booking-card";
import { BookedSkeleton } from "../components/skeleton";

export function BookingsPage() {
	const navigate = useNavigate();

	const { isLoading, isError, data } = useQuery({
		queryKey: ["rooms", "search"],
		queryFn: () => bookingService.getBookedRooms(),
	});

	const rooms = data ?? [];
	const sortedRooms = rooms?.sort((a, b) =>
		a.bookingStatus.localeCompare(b.bookingStatus),
	);

	return (
		<div className="space-y-8">
			<section className="surface-section">
				<h1 className="text-3xl font-semibold text-slate-900">
					Habitaciones reservadas
				</h1>
				<p className="mt-2 text-sm text-slate-600">
					Mira las habitaciones de las que solicitaste una reserva. Las
					habitaciones ya confirmadas aparecerán primero.
				</p>
			</section>

			<section className="space-y-4">
				<div>
					{!isLoading && !isError && (
						<p className="text-sm text-slate-500">
							{sortedRooms.length === 0
								? "No se encontraron habitaciones."
								: `${sortedRooms.length} ${sortedRooms.length !== 1 ? "habitaciones reservadas" : "habitación reservada"}.`}
						</p>
					)}
				</div>

				{isLoading ? (
					<BookedSkeleton quantity={3} />
				) : isError ? (
					<div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-tertiary shadow-sm">
						Hubo un problema al cargar las habitaciones. Por favor, intente de
						nuevo más tarde.
					</div>
				) : sortedRooms.length === 0 ? (
					<div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-slate-600 shadow-sm">
						No hay habitaciones que se ajusten a los filtros introducidos.
						Pruebe a ajustar su búsqueda
					</div>
				) : (
					<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
						{sortedRooms.map((room) => (
							<BookingCard
								key={room.roomId}
								name={room.bookingRoomName}
								status={room.bookingStatus}
								onClick={() => navigate(`/details/${room.roomId}`)}
							/>
						))}
					</div>
				)}
			</section>
			<Footer />
		</div>
	);
}
