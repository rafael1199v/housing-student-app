import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import bookingService from "../../../services/bookingService";
import { BookingCard } from "../components/booking-card";
import { BookedSkeleton } from "../components/skeleton";

export function BookingsPage() {
	const { t } = useTranslation();
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
					{t("bookings.title")}
				</h1>
				<p className="mt-2 text-sm text-slate-600">{t("bookings.subtitle")}</p>
			</section>

			<section className="space-y-4">
				<div>
					{!isLoading && !isError && (
						<p className="text-sm text-slate-500">
							{sortedRooms.length === 0
								? t("bookings.noRooms")
								: t("bookings.count", { count: sortedRooms.length })}
						</p>
					)}
				</div>

				{isLoading ? (
					<BookedSkeleton quantity={3} />
				) : isError ? (
					<div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-tertiary shadow-sm">
						{t("bookings.loadError")}
					</div>
				) : sortedRooms.length === 0 ? (
					<div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-slate-600 shadow-sm">
						{t("bookings.noMatch")}
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
		</div>
	);
}
