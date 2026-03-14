interface CardProps {
	name: string;
	price: number;
	description: string;
	imageUrl: string;
	onClick?: () => void;
}

export function Card({
	name,
	price,
	description,
	imageUrl,
	onClick,
}: CardProps) {
	const formattedPrice = new Intl.NumberFormat("es-CO").format(price);
	const shortDescription =
		description.length > 120
			? `${description.slice(0, 120).trim()}...`
			: description;

	return (
		<div
			className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ${
				onClick ? "cursor-pointer transition hover:-translate-y-0.5" : ""
			}`}
			onClick={onClick}
			onKeyDown={(event) => {
				if (!onClick) {
					return;
				}

				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					onClick();
				}
			}}
			role={onClick ? "button" : undefined}
			tabIndex={onClick ? 0 : undefined}
		>
			<div className="h-44 w-full bg-slate-100">
				{imageUrl ? (
					<img
						src={imageUrl}
						alt={name}
						className="h-full w-full object-cover"
					/>
				) : (
					<div className="flex h-full items-center justify-center text-sm font-medium text-slate-400">
						Sin imagen disponible
					</div>
				)}
			</div>

			<div className="space-y-3 p-5">
				<div className="space-y-1">
					<h3 className="text-lg font-semibold text-slate-900">{name}</h3>
					<p className="text-sm text-slate-500">Habitación para estudiantes</p>
				</div>

				<p className="text-2xl font-bold text-blue-600">${formattedPrice}</p>
				<p className="-mt-2 text-xs text-slate-500">por mes</p>

				<p className="text-sm leading-relaxed text-slate-600">
					{shortDescription}
				</p>
			</div>
		</div>
	);
}
