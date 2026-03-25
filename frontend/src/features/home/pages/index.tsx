import { useQuery } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import roomService from "../../../services/roomService";
import { useUser } from "../../auth/store/authStore";
import { Footer } from "../../shared/components/footer";
import { RoomCard } from "../../shared/components/RoomCard";
import { CardSkeleton } from "../components/skeleton";

export function HomePage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const user = useUser();

	const initialSearch = searchParams.get("name") ?? "";
	const initialMinPrice = searchParams.get("minPrice") ?? "";
	const initialMaxPrice = searchParams.get("maxPrice") ?? "";

	const [searchText, setSearchText] = useState(initialSearch);
	const [minPrice, setMinPrice] = useState(initialMinPrice);
	const [maxPrice, setMaxPrice] = useState(initialMaxPrice);

	const { isLoading, isError, data } = useQuery({
		queryKey: ["rooms"],
		queryFn: roomService.getRooms,
	});

	const rooms = data ?? [];

	const buildRoomsPath = () => {
		const params = new URLSearchParams();

		if (searchText.trim()) {
			params.set("name", searchText.trim());
		}

		if (minPrice.trim()) {
			params.set("minPrice", minPrice.trim());
		}

		if (maxPrice.trim()) {
			params.set("maxPrice", maxPrice.trim());
		}

		return params.size > 0 ? `/rooms?${params.toString()}` : "/rooms";
	};

	const handleSearchRedirect = () => {
		navigate(buildRoomsPath());
	};

	const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		handleSearchRedirect();
	};

	const welcomeName = user?.email?.split("@")[0] ?? "student";

	return (
		<div className="space-y-8">
			<section className="surface-section">
				<h1 className="text-3xl font-semibold text-slate-900">
					Welcome, {welcomeName}!
				</h1>
				<p className="mt-2 text-sm text-slate-600">
					Find your next room quickly.
				</p>

				<form className="mt-6 space-y-4" onSubmit={handleSearchSubmit}>
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

					<div className="space-y-2">
						<p className="text-sm font-medium text-slate-700">Price range</p>
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
				</form>
			</section>

			<section className="space-y-4">
				<div>
					<h2 className="text-xl font-semibold text-slate-900">
						Featured rooms
					</h2>
					<p className="text-sm text-slate-500">
						Quickly jump to room details.
					</p>
				</div>

				{isLoading ? (
					<CardSkeleton quantity={3} />
				) : isError ? (
					<div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-tertiary shadow-sm">
						Could not load rooms. Please try again later.
					</div>
				) : rooms.length === 0 ? (
					<div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-slate-600 shadow-sm">
						No rooms match the current search filters.
					</div>
				) : (
					<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
						{rooms.map((room) => (
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

				<button
					type="button"
					onClick={() => navigate("/rooms")}
					className="w-full rounded-full bg-secondary-fixed px-4 py-3 text-sm font-medium text-on-secondary-fixed transition hover:brightness-95"
				>
					Show more rooms
				</button>
			</section>
			<Footer />
		</div>
	);
}
