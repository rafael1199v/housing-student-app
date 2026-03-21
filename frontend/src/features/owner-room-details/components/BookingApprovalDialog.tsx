import type { BookingDto } from "../types/roomHouseholderDetailDto";

interface BookingApprovalDialogProps {
	booking: BookingDto | null;
	isOpen: boolean;
	isLoading?: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export function BookingApprovalDialog({
	booking,
	isOpen,
	isLoading,
	onConfirm,
	onCancel,
}: BookingApprovalDialogProps) {
	if (!isOpen || !booking) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm">
			<div className="w-full max-w-sm space-y-6 rounded-2xl bg-surface-container-lowest p-6 shadow-2xl">
				<div className="space-y-2">
					<h2 className="text-xl font-semibold text-slate-900">
						Confirm Booking Approval
					</h2>
					<p className="text-sm text-slate-600">
						Are you sure you want to approve this booking request?
					</p>
				</div>

				<div className="space-y-3 rounded-lg bg-surface-container-low p-4">
					<div>
						<p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
							Booker Name
						</p>
						<p className="text-slate-900 font-semibold">{booking.bookerName}</p>
					</div>
					<div>
						<p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
							Email
						</p>
						<p className="text-slate-900">{booking.bookerEmail}</p>
					</div>
					<div className="pt-2">
						<p className="text-xs text-slate-600">
							Once approved, this booking will be confirmed and all other
							pending requests will be rejected.
						</p>
					</div>
				</div>

				<div className="flex gap-3">
					<button
						type="button"
						onClick={onCancel}
						disabled={isLoading}
						className="flex-1 rounded-full bg-surface-container-high px-4 py-2 font-medium text-slate-900 transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-60"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={isLoading}
						className="flex-1 rounded-full bg-primary px-4 py-2 font-medium text-on-primary transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isLoading ? "Approving..." : "Approve"}
					</button>
				</div>
			</div>
		</div>
	);
}
