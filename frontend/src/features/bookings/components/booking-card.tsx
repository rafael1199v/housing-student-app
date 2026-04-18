import { useTranslation } from "react-i18next";
import { BookingStatusEnum } from "../../../global/enum/booking-status";

interface BookingCardProps {
	name: string;
	status: string;
	onClick?: () => void;
}

export function BookingCard({ name, status, onClick }: BookingCardProps) {
	const { t } = useTranslation();

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
				<div className="mt-1 inline-block text-xs font-medium text-on-secondary-fixed">
					{status == BookingStatusEnum.Confirmed ? (
						<div className="bg-green-200 rounded-full px-2 py-1">
							{t("bookings.status.confirmed")}
						</div>
					) : status == BookingStatusEnum.Pending ? (
						<div className="bg-secondary-fixed rounded-full px-2 py-1">
							{t("bookings.status.pending")}
						</div>
					) : status == BookingStatusEnum.Rejected ? (
						<div className="bg-red-200 rounded-full px-2 py-1">
							{t("bookings.status.rejected")}
						</div>
					) : (
						<div className="bg-gray-300 rounded-full px-2 py-1">
							{t("bookings.status.unknown", { status })}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
