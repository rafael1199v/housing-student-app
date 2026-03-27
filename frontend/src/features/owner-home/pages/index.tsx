import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import roomService from "../../../services/roomService";
import { useUser } from "../../auth/store/authStore";
import { CardSkeleton } from "../../home/components/skeleton";
import { Footer } from "../../shared/components/footer";
import { RoomCard } from "../../shared/components/RoomCard";

export function OwnerHomePage() {
	const navigate = useNavigate();
	const user = useUser();

	const { isLoading, isError, data } = useQuery({
		queryKey: ["owner", "rooms"],
		queryFn: roomService.getHouseholderRooms,
	});

	const rooms = data ?? [];
	const welcomeName = user?.email?.split("@")[0] ?? "arrendador";

	return (
		<div className="space-y-8">
			<section className="surface-section">
				<h1 className="text-3xl font-semibold text-slate-900">
					¡Bienvenido, {welcomeName}!
				</h1>
				<p className="mt-2 text-sm text-slate-600">
					Administra tus habitaciones publicadas y revisa la demanda
					rápidamente.
				</p>

				<button
					type="button"
					onClick={() => navigate("/owner/rooms/new")}
					className="btn-primary mt-6"
				>
					Crear nueva habitación
				</button>
			</section>

			<section className="space-y-4">
				<div>
					<h2 className="text-xl font-semibold text-slate-900">
						Tus habitaciones
					</h2>
					<p className="text-sm text-slate-500">
						Lista de habitaciones que creaste con la cantidad de solicitudes de
						reserva.
					</p>
				</div>

				{isLoading ? (
					<CardSkeleton quantity={3} />
				) : isError ? (
					<div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-tertiary shadow-sm">
						No se pudieron cargar tus habitaciones. Por favor, intenta de nuevo
						más tarde.
					</div>
				) : rooms.length === 0 ? (
					<div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-slate-600 shadow-sm">
						Aún no has creado ninguna habitación.
					</div>
				) : (
					<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
						{rooms.map((room) => (
							<RoomCard
								key={room.id}
								name={room.name}
								price={room.price}
								images={room.imageRoomUrls}
								subtitle="Tu habitación publicada"
								description={room.description}
								onClick={() => navigate(`/owner/rooms/${room.id}`)}
							>
								<div className="flex gap-1 flex-row items-center rounded-lg bg-surface-container-low px-3 py-2">
									<p className="text-xs font-medium uppercase tracking-wide text-slate-500">
										Solicitudes de reserva:
									</p>
									<p className="text-base font-semibold text-slate-800">
										{room.bookingRequests}
									</p>
								</div>
							</RoomCard>
						))}
					</div>
				)}
			</section>
			<Footer />
		</div>
	);
}
