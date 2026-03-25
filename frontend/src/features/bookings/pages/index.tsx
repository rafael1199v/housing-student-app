import { useQuery } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router";
import bookingService from "../../../services/bookingService";
import { useAccessToken } from "../../auth/store/authStore";
import { getRoleFromAccessToken } from "../../auth/utils/tokenClaims";
import { Footer } from "../../shared/components/footer";
import { BookingCard } from "../components/booking-card";
import { BookedSkeleton } from "../components/skeleton";

export function BookingsPage() {
	const navigate = useNavigate();
	const token = useAccessToken();
	const role = getRoleFromAccessToken(token);

	const { isLoading, isError, data } = useQuery({
		queryKey: ["rooms", "search"],
		queryFn: () => bookingService.getBookedRooms(),
	});

	const rooms = data ?? [];
	const sortedRooms = rooms?.sort((a, b) =>
		a.bookingStatus.localeCompare(b.bookingStatus),
	);

	if (role !== "Student") {
		return <Navigate to="/not-found" replace />;
	}

	return (
		<div className="space-y-8">
			<section className="surface-section">
				<h1 className="text-3xl font-semibold text-slate-900">Booked rooms</h1>
				<p className="mt-2 text-sm text-slate-600">
					Take a look at the rooms you already booked. Confirmed books appear
					first.
				</p>
			</section>

			<section className="space-y-4">
				<div>
					{!isLoading && !isError && (
						<p className="text-sm text-slate-500">
							{sortedRooms.length === 0
								? "No rooms found."
								: `${sortedRooms.length} booked room${sortedRooms.length !== 1 ? "s" : ""}.`}
						</p>
					)}
				</div>

				{isLoading ? (
					<BookedSkeleton quantity={3} />
				) : isError ? (
					<div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-tertiary shadow-sm">
						Could not load rooms. Please try again later.
					</div>
				) : sortedRooms.length === 0 ? (
					<div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-slate-600 shadow-sm">
						No rooms match the current search filters. Try adjusting your
						search.
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
