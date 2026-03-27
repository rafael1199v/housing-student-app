interface BookedSkeletonProps {
	quantity: number;
}

export function BookedSkeleton({ quantity }: BookedSkeletonProps) {
	return (
		<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
			{Array.from(Array(quantity), (_, i) => {
				return (
					<div key={i} className="surface-card overflow-hidden animate-pulse">
						<div className="space-y-3 p-5">
							<div className="h-6 w-3/4 rounded bg-slate-200"></div>

							<div className="h-3 w-1/4 rounded bg-slate-200"></div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
