interface CardSkeletonProps {
	quantity: number;
}

export function CardSkeleton({ quantity }: CardSkeletonProps) {
	return (
		<div className="flex flex-col gap-4">
			{Array.from(Array(quantity), (_, i) => {
				return (
					<div
						key={i}
						className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 animate-pulse"
					>
						{/* Image placeholder */}
						{/* <div className="w-full h-48 bg-slate-200 rounded-md mb-4"></div> */}

						{/* Name placeholder */}
						<div className="h-6 bg-slate-200 rounded mb-3 w-3/4"></div>

						{/* Price placeholder */}
						<div className="h-5 bg-slate-200 rounded mb-3 w-1/3"></div>

						{/* Description placeholder */}
						<div className="space-y-2">
							<div className="h-4 bg-slate-200 rounded"></div>
							<div className="h-4 bg-slate-200 rounded w-5/6"></div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
