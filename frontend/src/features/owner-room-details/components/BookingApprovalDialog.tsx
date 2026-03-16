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
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-xl shadow-lg max-w-sm w-full space-y-6 p-6">
				<div className="space-y-2">
					<h2 className="text-xl font-semibold text-slate-900">
						Confirm Booking Approval
					</h2>
					<p className="text-sm text-slate-600">
						Are you sure you want to approve this booking request?
					</p>
				</div>

				<div className="bg-slate-50 rounded-lg p-4 space-y-3">
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
					<div className="pt-2 border-t border-slate-200">
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
						className="flex-1 px-4 py-2 border border-slate-300 text-slate-900 font-medium rounded-lg hover:bg-slate-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={isLoading}
						className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
					>
						{isLoading ? "Approving..." : "Approve"}
					</button>
				</div>
			</div>
		</div>
	);
}
