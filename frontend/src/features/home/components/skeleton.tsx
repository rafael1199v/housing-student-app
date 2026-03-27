interface CardSkeletonProps {
	quantity: number;
}

export function CardSkeleton({ quantity }: CardSkeletonProps) {
	return (
		<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
			{Array.from(Array(quantity), (_, i) => {
				return (
					<div key={i} className="surface-card overflow-hidden animate-pulse">
						<div className="h-44 w-full bg-slate-200"></div>

						<div className="space-y-3 p-5">
							<div className="h-6 w-3/4 rounded bg-slate-200"></div>
							<div className="h-4 w-1/2 rounded bg-slate-200"></div>

							<div className="h-7 w-2/5 rounded bg-slate-200"></div>
							<div className="h-3 w-1/4 rounded bg-slate-200"></div>

							<div className="space-y-2 pt-1">
								<div className="h-4 rounded bg-slate-200"></div>
								<div className="h-4 w-5/6 rounded bg-slate-200"></div>
								<div className="h-4 w-2/3 rounded bg-slate-200"></div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
