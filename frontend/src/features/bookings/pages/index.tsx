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

	return (
		<div className="space-y-8">
			<section className="surface-section">
				<h1 className="text-3xl font-semibold text-slate-900">Booked rooms</h1>
				<p className="mt-2 text-sm text-slate-600">
					Take a look at the rooms you already booked.
				</p>
			</section>

			<section className="space-y-4">
				<div>
					{!isLoading && !isError && (
						<p className="text-sm text-slate-500">
							{rooms.length === 0
								? "No rooms found."
								: `${rooms.length} booked room${rooms.length !== 1 ? "s" : ""}.`}
						</p>
					)}
				</div>

				{isLoading ? (
					<BookedSkeleton quantity={3} />
				) : isError ? (
					<div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-tertiary shadow-sm">
						Could not load rooms. Please try again later.
					</div>
				) : rooms.length === 0 ? (
					<div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-slate-600 shadow-sm">
						No rooms match the current search filters. Try adjusting your
						search.
					</div>
				) : (
					<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
						{rooms.map((room) => (
							<BookingCard
								key={room.room_id}
								name={room.name}
								status={room.status}
								onClick={() => navigate(`/details/${room.room_id}`)}
							/>
						))}
					</div>
				)}
			</section>
			<Footer />
		</div>
	);
}
