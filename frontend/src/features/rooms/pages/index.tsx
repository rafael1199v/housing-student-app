import { useQuery } from "@tanstack/react-query";
import {
	AdvancedMarker,
	Map as GoogleMap,
	type MapMouseEvent,
	Pin,
} from "@vis.gl/react-google-maps";
import { type FormEvent, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router";
import type { RoomSearchParams } from "../../../services/roomService";
import roomService from "../../../services/roomService";
import { useAccessToken } from "../../auth/store/authStore";
import { getRoleFromAccessToken } from "../../auth/utils/tokenClaims";
import { CardSkeleton } from "../../home/components/skeleton";
import type { RoomData } from "../../home/types/roomDataDto";
import { Footer } from "../../shared/components/footer";
import { RoomCard } from "../../shared/components/RoomCard";

type OrderBy = "price-asc" | "price-desc" | "name-asc" | "name-desc";
type MapPosition = { lat: number; lng: number };
const DEFAULT_MAP_CENTER = { lat: -17.695442, lng: -63.150744 };

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
	const token = useAccessToken();
	const role = getRoleFromAccessToken(token);

	const [searchParams, setSearchParams] = useSearchParams();

	const initialName = searchParams.get("name") ?? searchParams.get("q") ?? "";
	const initialMinPrice = searchParams.get("minPrice") ?? "";
	const initialMaxPrice = searchParams.get("maxPrice") ?? "";
	const initialLatitude = searchParams.get("latitude");
	const initialLongitude = searchParams.get("longitude");
	const hasInitialCoordinates =
		initialLatitude !== null && initialLongitude !== null;
	const initialPosition = hasInitialCoordinates
		? {
				lat: Number(initialLatitude),
				lng: Number(initialLongitude),
			}
		: null;

	const [searchText, setSearchText] = useState(initialName);
	const [minPrice, setMinPrice] = useState(initialMinPrice);
	const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
	const [orderBy, setOrderBy] = useState<OrderBy>("price-asc");
	const [selectedPosition, setSelectedPosition] = useState<MapPosition | null>(
		initialPosition &&
			Number.isFinite(initialPosition.lat) &&
			Number.isFinite(initialPosition.lng)
			? initialPosition
			: null,
	);

	const [committed, setCommitted] = useState<RoomSearchParams>({
		name: initialName,
		minPrice: initialMinPrice,
		maxPrice: initialMaxPrice,
		longitude: initialLongitude ?? undefined,
		latitude: initialLatitude ?? undefined,
	});

	const handleMapClick = (event: MapMouseEvent) => {
		if (!event.detail.latLng) return;

		const position = {
			lat: event.detail.latLng.lat,
			lng: event.detail.latLng.lng,
		};

		setSelectedPosition(position);
	};

	const { isLoading, isError, data } = useQuery({
		queryKey: ["rooms", "search", committed],
		queryFn: () => roomService.searchRooms(committed),
	});

	const rooms = data ?? [];
	const sortedRooms = sortRooms(rooms, orderBy);

	if (role !== "Student") {
		return <Navigate to="/not-found" replace />;
	}

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const next: RoomSearchParams = {
			name: searchText.trim(),
			minPrice: minPrice.trim(),
			maxPrice: maxPrice.trim(),
			longitude: selectedPosition?.lng,
			latitude: selectedPosition?.lat,
		};
		setCommitted(next);
		const params = new URLSearchParams();
		if (next.name) params.set("name", next.name);
		if (next.minPrice !== undefined && next.minPrice !== "") {
			params.set("minPrice", String(next.minPrice));
		}
		if (next.maxPrice !== undefined && next.maxPrice !== "") {
			params.set("maxPrice", String(next.maxPrice));
		}
		if (next.latitude !== undefined)
			params.set("latitude", String(next.latitude));
		if (next.longitude !== undefined)
			params.set("longitude", String(next.longitude));
		setSearchParams(params, { replace: true });
	};

	return (
		<div className="space-y-8">
			<section className="surface-section">
				<h1 className="text-3xl font-semibold text-slate-900">Search rooms</h1>
				<p className="mt-2 text-sm text-slate-600">
					Filter by name, price range, and sorting preference.
				</p>

				<form className="mt-6 space-y-4" onSubmit={handleSubmit}>
					<div className="flex items-center gap-2 rounded-lg border border-outline-variant/25 bg-surface-container-high px-3 py-2 focus-within:ring-2 focus-within:ring-primary/40">
						<input
							type="search"
							value={searchText}
							onChange={(event) => setSearchText(event.target.value)}
							placeholder="Search room by name"
							className="w-full bg-transparent text-sm text-slate-700 outline-none"
						/>
						<button
							type="submit"
							className="rounded-md p-1 text-slate-600 transition hover:bg-surface-container hover:text-slate-900"
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
					<div className="grid gap-2 sm:grid-cols-1">
						<section className="hidden surface-section space-y-2">
							<p className="text-sm font-medium text-slate-700">Location</p>
							<div className="overflow-hidden rounded-xl border border-outline-variant/35">
								<GoogleMap
									mapId={"ede7684c941ba061c27c52d4"}
									style={{ height: "25dvh", width: "100%" }}
									defaultCenter={DEFAULT_MAP_CENTER}
									defaultZoom={13}
									gestureHandling="greedy"
									onClick={handleMapClick}
								>
									{selectedPosition && (
										<AdvancedMarker position={selectedPosition}>
											<Pin
												background={"#0f9d58"}
												borderColor={"#006425"}
												glyphColor={"#60d98f"}
											/>
										</AdvancedMarker>
									)}
								</GoogleMap>
							</div>

							<div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
								{selectedPosition ? (
									<p>
										Selected location: {selectedPosition.lat.toFixed(6)},
										{selectedPosition.lng.toFixed(6)}
									</p>
								) : (
									<p>No location selected yet.</p>
								)}

								{selectedPosition && (
									<button
										type="button"
										onClick={() => {
											setSelectedPosition(null);
										}}
										className="text-primary underline underline-offset-2"
									>
										Clear marker
									</button>
								)}
							</div>
						</section>
						<div className="flex flex-col justify-around">
							<div className="space-y-2">
								<p className="text-sm font-medium text-slate-700">
									Price range
								</p>
								<div className="grid gap-2 sm:grid-cols-2">
									<input
										type="number"
										inputMode="numeric"
										min={0}
										value={minPrice}
										onChange={(event) => setMinPrice(event.target.value)}
										placeholder="Min price"
										className="field-filled"
									/>
									<input
										type="number"
										inputMode="numeric"
										min={0}
										value={maxPrice}
										onChange={(event) => setMaxPrice(event.target.value)}
										placeholder="Max price"
										className="field-filled"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<p className="text-sm font-medium text-slate-700">Order by</p>
								<select
									value={orderBy}
									onChange={(event) =>
										setOrderBy(event.target.value as OrderBy)
									}
									className="field-filled w-full"
								>
									<option value="price-asc">Price (ascending)</option>
									<option value="price-desc">Price (descending)</option>
									<option value="name-asc">A-Z</option>
									<option value="name-desc">Z-A</option>
								</select>
							</div>
						</div>
					</div>

					<button type="submit" className="btn-primary w-full">
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
							<RoomCard
								key={room.id}
								name={room.name}
								price={room.price}
								description={room.description}
								images={room.imageRoomUrls}
								onClick={() => navigate(`/details/${room.id}`)}
							/>
						))}
					</div>
				)}
			</section>

			{!isLoading && !isError && rooms.length >= 20 && (
				<div className="rounded-xl bg-surface-container-low p-5 text-sm text-slate-600 shadow-sm">
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
