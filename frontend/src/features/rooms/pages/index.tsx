import { useQuery } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";
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

export function RoomsPage() {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	const initialQ = searchParams.get("q") ?? "";
	const initialMinPrice = searchParams.get("minPrice") ?? "";
	const initialMaxPrice = searchParams.get("maxPrice") ?? "";

	const [searchText, setSearchText] = useState(initialQ);
	const [minPrice, setMinPrice] = useState(initialMinPrice);
	const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
	const [orderBy, setOrderBy] = useState<OrderBy>("price-asc");

	const [committed, setCommitted] = useState({
		name: initialQ,
		minPrice: initialMinPrice,
		maxPrice: initialMaxPrice,
	});

	const { isLoading, isError, data } = useQuery({
		queryKey: ["rooms", "search", committed],
		queryFn: () => roomService.searchRooms(committed),
	});

	const rooms = data ?? [];
	const sortedRooms = sortRooms(rooms, orderBy);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const next = {
			name: searchText.trim(),
			minPrice: minPrice.trim(),
			maxPrice: maxPrice.trim(),
		};
		setCommitted(next);
		const params = new URLSearchParams();
		if (next.name) params.set("name", next.name);
		if (next.minPrice) params.set("minPrice", next.minPrice);
		if (next.maxPrice) params.set("maxPrice", next.maxPrice);
		setSearchParams(params, { replace: true });
	};

	return (
		<div className="space-y-8">
			<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				<h1 className="text-3xl font-semibold text-slate-900">Search rooms</h1>
				<p className="mt-2 text-sm text-slate-600">
					Filter by name, price range, and sorting preference.
				</p>

				<form className="mt-6 space-y-4" onSubmit={handleSubmit}>
					<div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-200">
						<input
							type="search"
							value={searchText}
							onChange={(event) => setSearchText(event.target.value)}
							placeholder="Search room by name"
							className="w-full bg-transparent text-sm text-slate-700 outline-none"
						/>
						<button
							type="submit"
							className="rounded-md p-1 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
							aria-label="Search rooms"
						>
							<svg
								className="h-5 w-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
								/>
							</svg>
						</button>
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<p className="text-sm font-medium text-slate-700">Price range</p>
							<div className="grid gap-2 grid-cols-2">
								<input
									type="number"
									inputMode="numeric"
									min={0}
									value={minPrice}
									onChange={(event) => setMinPrice(event.target.value)}
									placeholder="Min price"
									className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
								/>
								<input
									type="number"
									inputMode="numeric"
									min={0}
									value={maxPrice}
									onChange={(event) => setMaxPrice(event.target.value)}
									placeholder="Max price"
									className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<p className="text-sm font-medium text-slate-700">Order by</p>
							<select
								value={orderBy}
								onChange={(event) => setOrderBy(event.target.value as OrderBy)}
								className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
							>
								<option value="price-asc">Price (ascending)</option>
								<option value="price-desc">Price (descending)</option>
								<option value="name-asc">A-Z</option>
								<option value="name-desc">Z-A</option>
							</select>
						</div>
					</div>

					<button
						type="submit"
						className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						Search
					</button>
				</form>
			</section>

			<section className="space-y-4">
				<div>
					<h2 className="text-xl font-semibold text-slate-900">Results</h2>
					{!isLoading && !isError && (
						<p className="text-sm text-slate-500">
							{sortedRooms.length === 0
								? "No rooms found."
								: `${sortedRooms.length} room${sortedRooms.length !== 1 ? "s" : ""} found.`}
						</p>
					)}
				</div>

				{isLoading ? (
					<CardSkeleton quantity={6} />
				) : isError ? (
					<div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-red-700">
						Could not load rooms. Please try again later.
					</div>
				) : sortedRooms.length === 0 ? (
					<div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
						No rooms match the current search filters. Try adjusting your
						search.
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

			{!isLoading && !isError && rooms.length >= 20 && (
				<div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
					<p className="font-medium text-slate-800">
						Showing up to 20 results.
					</p>
					<p className="mt-1">
						Didn't find what you were looking for? Try narrowing your search
						with a more specific name or a tighter price range to get more
						relevant results.
					</p>
				</div>
			)}

			<Footer />
		</div>
	);
}
