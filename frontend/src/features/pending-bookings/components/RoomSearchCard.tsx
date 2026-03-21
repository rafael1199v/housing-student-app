import { useState } from "react";

interface RoomSearchCardProps {
	name: string;
	price: number;
	description: string;
	images?: string[];
	onClick?: () => void;
}

export function RoomSearchCard({
	name,
	price,
	description,
	images,
	onClick,
}: RoomSearchCardProps) {
	const allImages = images?.length ? images : [];
	const [currentIndex, setCurrentIndex] = useState(0);

	const formattedPrice = new Intl.NumberFormat("es-BO").format(price);
	const shortDescription =
		description.length > 120
			? `${description.slice(0, 120).trim()}...`
			: description;

	const handlePrev = (event: React.MouseEvent) => {
		event.stopPropagation();
		setCurrentIndex((prev) => Math.max(0, prev - 1));
	};

	const handleNext = (event: React.MouseEvent) => {
		event.stopPropagation();
		setCurrentIndex((prev) => Math.min(allImages.length - 1, prev + 1));
	};

	const currentImage = allImages[currentIndex];
	const hasMultiple = allImages.length > 1;

	return (
		<div
			className={`surface-card overflow-hidden ${
				onClick ? "cursor-pointer transition hover:-translate-y-0.5" : ""
			}`}
			onClick={onClick}
			onKeyDown={(event) => {
				if (!onClick) return;
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					onClick();
				}
			}}
			role={onClick ? "button" : undefined}
			tabIndex={onClick ? 0 : undefined}
		>
			<div className="relative h-44 w-full bg-surface-container-low">
				{currentImage ? (
					<img
						src={currentImage}
						alt={`${name} – image ${currentIndex + 1}`}
						className="h-full w-full object-cover"
					/>
				) : (
					<div className="flex h-full items-center justify-center text-sm font-medium text-slate-400">
						Sin imagen disponible
					</div>
				)}

				{hasMultiple && (
					<>
						<button
							type="button"
							aria-label="Previous image"
							onClick={handlePrev}
							disabled={currentIndex === 0}
							className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-surface-container-lowest/80 p-1 text-slate-700 shadow backdrop-blur-sm transition hover:bg-surface-container-lowest disabled:cursor-not-allowed disabled:opacity-40"
						>
							<svg
								className="h-4 w-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 19l-7-7 7-7"
								/>
							</svg>
						</button>

						<button
							type="button"
							aria-label="Next image"
							onClick={handleNext}
							disabled={currentIndex === allImages.length - 1}
							className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-surface-container-lowest/80 p-1 text-slate-700 shadow backdrop-blur-sm transition hover:bg-surface-container-lowest disabled:cursor-not-allowed disabled:opacity-40"
						>
							<svg
								className="h-4 w-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>

						<div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
							{allImages.map((_, i) => (
								<span
									key={i}
									className={`block h-1.5 w-1.5 rounded-full transition ${
										i === currentIndex ? "bg-white" : "bg-white/50"
									}`}
								/>
							))}
						</div>
					</>
				)}
			</div>

			<div className="space-y-3 p-5">
				<div className="space-y-1">
					<h3 className="text-lg font-semibold text-slate-900">{name}</h3>
					<p className="text-sm text-slate-500">Habitación para estudiantes</p>
				</div>

				<p className="text-2xl font-bold text-primary">${formattedPrice}</p>
				<p className="-mt-2 text-xs text-slate-500">por mes</p>

				<p className="text-sm leading-relaxed text-slate-600">
					{shortDescription}
				</p>
			</div>
		</div>
	);
}
