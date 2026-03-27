interface BookingCardProps {
	name: string;
	status: string;
	onClick?: () => void;
}

export function BookingCard({ name, status, onClick }: BookingCardProps) {
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
			<div className="space-y-3 p-5">
				<div className="space-y-1">
					<h3 className="text-lg font-semibold text-slate-900">{name}</h3>
				</div>
				{status == "Confirmed" ? (
					<div className="mt-1 inline-block rounded-full bg-green-200 px-2 py-1 text-xs font-medium text-on-secondary-fixed">
						Confirmado
					</div>
				) : status == "Pending" ? (
					<div className="mt-1 inline-block rounded-full bg-secondary-fixed px-2 py-1 text-xs font-medium text-on-secondary-fixed">
						Pendiente
					</div>
				) : status == "Rejected" ? (
					<div className="mt-1 inline-block rounded-full bg-red-200 px-2 py-1 text-xs font-medium text-on-secondary-fixed">
						Rechazado
					</div>
				) : (
					<div className="mt-1 inline-block rounded-full bg-gray-300 px-2 py-1 text-xs font-medium text-on-secondary-fixed">
						Desconocido({status})
					</div>
				)}
			</div>
		</div>
	);
}
