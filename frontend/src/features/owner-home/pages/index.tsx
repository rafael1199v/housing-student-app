import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import roomService from "../../../services/roomService";
import { useUser } from "../../auth/store/authStore";
import { CardSkeleton } from "../../home/components/skeleton";
import { RoomCard } from "../../shared/components/RoomCard";

export function OwnerHomePage() {
	const { t } = useTranslation();
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
					{t("ownerHome.welcome", { name: welcomeName })}
				</h1>
				<p className="mt-2 text-sm text-slate-600">{t("ownerHome.subtitle")}</p>

				<button
					type="button"
					onClick={() => navigate("/owner/rooms/new")}
					className="btn-primary mt-6"
				>
					{t("ownerHome.createRoom")}
				</button>
			</section>

			<section className="space-y-4">
				<div>
					<h2 className="text-xl font-semibold text-slate-900">
						{t("ownerHome.roomsTitle")}
					</h2>
					<p className="text-sm text-slate-500">
						{t("ownerHome.roomsSubtitle")}
					</p>
				</div>

				{isLoading ? (
					<CardSkeleton quantity={3} />
				) : isError ? (
					<div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-tertiary shadow-sm">
						{t("ownerHome.loadError")}
					</div>
				) : rooms.length === 0 ? (
					<div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-slate-600 shadow-sm">
						{t("ownerHome.noRooms")}
					</div>
				) : (
					<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
						{rooms.map((room) => (
							<RoomCard
								key={room.id}
								name={room.name}
								price={room.price}
								images={room.imageRoomUrls}
								subtitle={t("ownerHome.roomSubtitle")}
								description={room.description}
								onClick={() => navigate(`/owner/rooms/${room.id}`)}
							>
								<div className="flex gap-1 flex-row items-center rounded-lg bg-surface-container-low px-3 py-2">
									<p className="text-xs font-medium uppercase tracking-wide text-slate-500">
										{t("ownerHome.bookingRequests")}
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
		</div>
	);
}
