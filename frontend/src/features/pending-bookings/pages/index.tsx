import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import roomService from "../../../services/roomService";
import { CardSkeleton } from "../../home/components/skeleton";
import type { RoomData } from "../../home/types/roomDataDto";
import { Footer } from "../../shared/components/footer";
import { RoomSearchCard } from "../components/RoomSearchCard";

type OrderBy = "price-asc" | "price-desc" | "name-asc" | "name-desc";

function sortRooms(rooms: RoomData[], orderBy: OrderBy): RoomData[] {
	const copy = [...rooms];
	switch (orderBy) {
		case "price-asc":
			return copy.sort((a, b) => a.price - b.price);
		case "price-desc":
			return copy.sort((a, b) => b.price - a.price);
		case "name-asc":
			return copy.sort((a, b) => a.name.localeCompare(b.name));
		case "name-desc":
			return copy.sort((a, b) => b.name.localeCompare(a.name));
	}
}

export function BookedRoomsPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const initialQ = searchParams.get("q") ?? "";
	const initialMinPrice = searchParams.get("minPrice") ?? "";
	const initialMaxPrice = searchParams.get("maxPrice") ?? "";

	const [orderBy] = useState<OrderBy>("price-asc");

	const [committed] = useState({
		name: initialQ,
		minPrice: initialMinPrice,
		maxPrice: initialMaxPrice,
	});

	const { isLoading, isError, data } = useQuery({
		queryKey: ["rooms", "search", committed],
		queryFn: () => roomService.searchRooms(committed),
	});
	// TODO: Obtener rooms por bookings del estudiante

	const rooms = data ?? [];
	const sortedRooms = sortRooms(rooms, orderBy);

	return (
		<div className="space-y-8">
			<section className="surface-section">
				<h1 className="text-3xl font-semibold text-slate-900">Booked rooms</h1>
				<p className="mt-2 text-sm text-slate-600">
					Take a look at the rooms you requested a reservation for.
				</p>
			</section>

			<section className="space-y-4">
				<div>
					{/* <h2 className="text-xl font-semibold text-slate-900"></h2> */}
					{!isLoading && !isError && (
						<p className="text-sm text-slate-500">
							{sortedRooms.length === 0
								? "No rooms found."
								: `${sortedRooms.length} room${sortedRooms.length !== 1 ? "s" : ""} found.`}
						</p>
					)}
				</div>

				{isLoading ? (
					<CardSkeleton quantity={3} />
				) : isError ? (
					<div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-tertiary shadow-sm">
						Could not load rooms. Please try again later.
					</div>
				) : sortedRooms.length === 0 ? (
					<div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-slate-600 shadow-sm">
						You didn't book for any room yet...
					</div>
				) : (
					<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
						{sortedRooms.map((room) => (
							<RoomSearchCard
								key={room.id}
								name={room.name}
								price={room.price}
								description={room.description}
								images={room.images}
								onClick={() => navigate(`/details/${room.id}`)}
							/>
						))}
					</div>
				)}
			</section>
			<Footer />
		</div>
	);
}
