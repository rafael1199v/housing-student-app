import { useTranslation } from "react-i18next";
import type { BookingDto } from "../types/roomHouseholderDetailDto";

interface BookingDialogProps {
	booking: BookingDto | null;
	action: string;
	isOpen: boolean;
	isLoading?: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export function BookingActionDialog({
	booking,
	action,
	isOpen,
	isLoading,
	onConfirm,
	onCancel,
}: BookingDialogProps) {
	const { t } = useTranslation();
	if (!isOpen || !booking) return null;

	const isApprove = action === "approve";

	return (
		<div className="fixed inset-0 z-50 h-full flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm">
			<div className="w-full max-w-sm space-y-6 rounded-2xl bg-surface-container-lowest p-6 shadow-2xl">
				<div className="space-y-2">
					<h2 className="text-xl font-semibold text-slate-900">
						{isApprove
							? t("bookingDialog.titleApprove")
							: t("bookingDialog.titleReject")}
					</h2>
					<p className="text-sm text-slate-600">
						{isApprove
							? t("bookingDialog.subtitleApprove")
							: t("bookingDialog.subtitleReject")}
					</p>
				</div>

				<div className="space-y-3 rounded-lg bg-surface-container-low p-4">
					<div>
						<p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
							{t("bookingDialog.requesterName")}
						</p>
						<p className="text-slate-900 font-semibold">{booking.bookerName}</p>
					</div>
					<div>
						<p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
							{t("bookingDialog.email")}
						</p>
						<p className="text-slate-900">{booking.bookerEmail}</p>
					</div>
					<div className="pt-2">
						<p className="text-xs text-slate-600">
							{isApprove
								? t("bookingDialog.approveWarning")
								: t("bookingDialog.rejectWarning")}
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
						{t("bookingDialog.cancel")}
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={isLoading}
						className={
							"flex-1 rounded-full px-4 py-2 font-medium text-on-primary transition disabled:cursor-not-allowed disabled:opacity-60 " +
							(isApprove
								? "bg-primary hover:bg-primary-container"
								: "bg-red-800 hover:bg-red-500")
						}
					>
						{isLoading
							? t("bookingDialog.loading")
							: isApprove
								? t("bookingDialog.approve")
								: t("bookingDialog.reject")}
					</button>
				</div>
			</div>
		</div>
	);
}
