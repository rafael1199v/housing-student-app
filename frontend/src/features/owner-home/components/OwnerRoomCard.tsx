import { useState } from "react";
import type { RoomHouseholderDto } from "../types/roomHouseholderDto";

interface OwnerRoomCardProps {
	room: RoomHouseholderDto;
	onClick?: () => void;
	onEdit?: () => void;
}

export function OwnerRoomCard({ room, onClick, onEdit }: OwnerRoomCardProps) {
	console.log(room);
	const allImages = room.imageRoomUrls?.length ? room.imageRoomUrls : [];
	const [currentIndex, setCurrentIndex] = useState(0);
	const currentImage = allImages[currentIndex];
	const hasMultiple = allImages.length > 1;

	const formattedPrice = new Intl.NumberFormat("es-BO").format(room.price);

	const handlePrev = (event: React.MouseEvent) => {
		event.stopPropagation();
		setCurrentIndex((prev) => Math.max(0, prev - 1));
	};

	const handleNext = (event: React.MouseEvent) => {
		event.stopPropagation();
		setCurrentIndex((prev) => Math.min(allImages.length - 1, prev + 1));
	};

	const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		onEdit?.();
	};

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
						alt={`${room.name} – image ${currentIndex + 1}`}
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
				<div className="flex items-start justify-between gap-3">
					<div className="space-y-1">
						<h3 className="text-lg font-semibold text-slate-900">
							{room.name}
						</h3>
						<p className="text-sm text-slate-500">Tu habitación publicada</p>
					</div>

					<button
						type="button"
						onClick={handleEditClick}
						className="hidden rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
						aria-label={`Edit ${room.name}`}
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
								d="M16.862 3.487a2.1 2.1 0 0 1 2.97 2.97L8.25 18.04 4 19.5l1.46-4.25L16.862 3.487Z"
							/>
						</svg>
					</button>
				</div>

				<p className="text-2xl font-bold text-primary">${formattedPrice}</p>
				<p className="-mt-2 text-xs text-slate-500">por mes</p>

				<div className="rounded-lg bg-surface-container-low px-3 py-2">
					<p className="text-xs font-medium uppercase tracking-wide text-slate-500">
						Booking requests
					</p>
					<p className="mt-1 text-base font-semibold text-slate-800">
						{room.bookingRequests}
					</p>
				</div>
			</div>
		</div>
	);
}
