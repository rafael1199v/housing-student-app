import { useQuery } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import roomService from "../../../services/roomService";
import { useUser } from "../../auth/store/authStore";
import { Footer } from "../../shared/components/footer";
import { Card } from "../components/cards";
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
			<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				<h1 className="text-3xl font-semibold text-slate-900">
					Welcome, {welcomeName}!
				</h1>
				<p className="mt-2 text-sm text-slate-600">
					Find your next room quickly.
				</p>

				<form className="mt-6 space-y-4" onSubmit={handleSearchSubmit}>
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
					<div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-red-700">
						Could not load rooms. Please try again later.
					</div>
				) : rooms.length === 0 ? (
					<div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
						No rooms match the current search filters.
					</div>
				) : (
					<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
						{rooms.map((room) => (
							<Card
								key={room.id}
								name={room.name}
								price={room.price}
								description={room.description}
								images={room.images}
								onClick={() => navigate("/details")}
							/>
						))}
					</div>
				)}

				<button
					type="button"
					onClick={() => navigate("/rooms")}
					className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
				>
					Show more rooms
				</button>
			</section>
			<Footer />
		</div>
	);
}
