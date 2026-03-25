import { useState } from "react";

interface BookingCardProps {
	name: string;
	price: number;
	status: string;
	onClick?: () => void;
}

export function BookingCard({
	name,
	price,
	status,
	onClick,
}: BookingCardProps) {
	const formattedPrice = new Intl.NumberFormat("es-BO").format(price);

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
			<div className="relative h-44 w-full bg-surface-container-low"></div>

			<div className="space-y-3 p-5">
				<div className="space-y-1">
					<h3 className="text-lg font-semibold text-slate-900">{name}</h3>
				</div>

				<p className="text-2xl font-bold text-primary">${formattedPrice}</p>
				<p className="-mt-2 text-xs text-slate-500">por mes</p>

				<p className="text-sm leading-relaxed text-slate-600">{status}</p>
			</div>
		</div>
	);
}
