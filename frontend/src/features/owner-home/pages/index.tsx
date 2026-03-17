import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import roomService from "../../../services/roomService";
import { useUser } from "../../auth/store/authStore";
import { CardSkeleton } from "../../home/components/skeleton";
import { Footer } from "../../shared/components/footer";
import { OwnerRoomCard } from "../components/OwnerRoomCard";

export function OwnerHomePage() {
	const navigate = useNavigate();
	const user = useUser();

	const { isLoading, isError, data } = useQuery({
		queryKey: ["owner", "rooms"],
		queryFn: roomService.getHouseholderRooms,
	});

	const rooms = data ?? [];
	const welcomeName = user?.email?.split("@")[0] ?? "householder";

	return (
		<div className="space-y-8">
			<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				<h1 className="text-3xl font-semibold text-slate-900">
					Welcome, {welcomeName}!
				</h1>
				<p className="mt-2 text-sm text-slate-600">
					Manage your published rooms and review demand quickly.
				</p>

				<button
					type="button"
					onClick={() => navigate("/owner/rooms/new")}
					className="mt-6 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				>
					Create new room
				</button>
			</section>

			<section className="space-y-4">
				<div>
					<h2 className="text-xl font-semibold text-slate-900">Your rooms</h2>
					<p className="text-sm text-slate-500">
						List of rooms you created with booking request count.
					</p>
				</div>

				{isLoading ? (
					<CardSkeleton quantity={3} />
				) : isError ? (
					<div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-red-700">
						Could not load your rooms. Please try again later.
					</div>
				) : rooms.length === 0 ? (
					<div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
						You haven't created any rooms yet.
					</div>
				) : (
					<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
						{rooms.map((room) => (
							<OwnerRoomCard
								key={room.id}
								room={room}
								onClick={() => navigate(`/owner/rooms/${room.id}`)}
								onEdit={() => navigate(`/owner/rooms/${room.id}/edit`)}
							/>
						))}
					</div>
				)}
			</section>
			<Footer />
		</div>
	);
}
