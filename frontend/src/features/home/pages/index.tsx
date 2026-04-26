import { useQuery } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import { z } from "zod";
import i18n from "../../../i18n";
import roomService from "../../../services/roomService";
import { RoomCard } from "../../shared/components/RoomCard";
import { CardSkeleton } from "../components/skeleton";

const searchFiltersSchema = z
	.object({
		name: z
			.string()
			.max(100, i18n.t("search.nameTooLong", { ns: "validation" })),
		minPrice: z
			.string()
			.refine(
				(v) => v === "" || Number(v) >= 0,
				i18n.t("search.minPriceTooLow", { ns: "validation" }),
			)
			.refine(
				(v) => v === "" || Number(v) <= 99999,
				i18n.t("search.priceTooHigh", { ns: "validation" }),
			),
		maxPrice: z
			.string()
			.refine(
				(v) => v === "" || Number(v) >= 0,
				i18n.t("search.maxPriceTooLow", { ns: "validation" }),
			)
			.refine(
				(v) => v === "" || Number(v) <= 99999,
				i18n.t("search.priceTooHigh", { ns: "validation" }),
			),
	})
	.refine(
		(data) => {
			if (data.minPrice && data.maxPrice) {
				return Number(data.maxPrice) >= Number(data.minPrice);
			}
			return true;
		},
		{
			message: i18n.t("search.priceRangeInvalid", { ns: "validation" }),
			path: ["maxPrice"],
		},
	);

type SearchFilterErrors = {
	name?: string;
	minPrice?: string;
	maxPrice?: string;
};

export function HomePage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const initialSearch = searchParams.get("name") ?? "";
	const initialMinPrice = searchParams.get("minPrice") ?? "";
	const initialMaxPrice = searchParams.get("maxPrice") ?? "";

	const [searchText, setSearchText] = useState(initialSearch);
	const [minPrice, setMinPrice] = useState(initialMinPrice);
	const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
	const [errors, setErrors] = useState<SearchFilterErrors>({});

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
		const result = searchFiltersSchema.safeParse({
			name: searchText,
			minPrice,
			maxPrice,
		});
		if (!result.success) {
			const fieldErrors: SearchFilterErrors = {};
			for (const issue of result.error.issues) {
				const field = issue.path[0] as keyof SearchFilterErrors;
				if (!fieldErrors[field]) fieldErrors[field] = issue.message;
			}
			setErrors(fieldErrors);
			return;
		}
		setErrors({});
		handleSearchRedirect();
	};

	return (
		<div className="space-y-8">
			<section className="surface-section">
				<h1 className="text-3xl font-semibold text-slate-900">
					{t("home.welcome", { name: t(`roles.Student`) })}
				</h1>
				<p className="mt-2 text-sm text-slate-600">{t("home.subtitle")}</p>

				<form className="mt-6 space-y-4" onSubmit={handleSearchSubmit}>
					<div className="space-y-1">
						<div className="flex items-center gap-2 rounded-lg border border-outline-variant/25 bg-surface-container-high px-3 py-2 focus-within:ring-2 focus-within:ring-primary/40">
							<input
								type="search"
								value={searchText}
								onChange={(event) => setSearchText(event.target.value)}
								placeholder={t("home.searchPlaceholder")}
								className="w-full bg-transparent text-sm text-slate-700 outline-none"
							/>
							<button
								type="submit"
								className="rounded-md p-1 text-slate-600 transition hover:bg-surface-container hover:text-slate-900"
								aria-label={t("home.searchAriaLabel")}
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
						{errors.name && (
							<p className="text-xs text-red-600">{errors.name}</p>
						)}
					</div>

					<div className="space-y-2">
						<p className="text-sm font-medium text-slate-700">
							{t("home.priceRange")}
						</p>
						<div className="grid gap-2 sm:grid-cols-2">
							<div className="space-y-1">
								<input
									type="number"
									inputMode="numeric"
									min={0}
									value={minPrice}
									onChange={(event) => setMinPrice(event.target.value)}
									placeholder={t("home.minPricePlaceholder")}
									className="field-filled w-full"
								/>
								{errors.minPrice && (
									<p className="text-xs text-red-600">{errors.minPrice}</p>
								)}
							</div>
							<div className="space-y-1">
								<input
									type="number"
									inputMode="numeric"
									min={0}
									value={maxPrice}
									onChange={(event) => setMaxPrice(event.target.value)}
									placeholder={t("home.maxPricePlaceholder")}
									className="field-filled w-full"
								/>
								{errors.maxPrice && (
									<p className="text-xs text-red-600">{errors.maxPrice}</p>
								)}
							</div>
						</div>
					</div>
				</form>
			</section>

			<section className="space-y-4">
				<div>
					<h2 className="text-xl font-semibold text-slate-900">
						{t("home.featuredTitle")}
					</h2>
					<p className="text-sm text-slate-500">{t("home.featuredSubtitle")}</p>
				</div>

				{isLoading ? (
					<CardSkeleton quantity={3} />
				) : isError ? (
					<div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-tertiary shadow-sm">
						{t("home.loadError")}
					</div>
				) : rooms.length === 0 ? (
					<div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-slate-600 shadow-sm">
						{t("home.noRooms")}
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
					{t("home.showMore")}
				</button>
			</section>
		</div>
	);
}
