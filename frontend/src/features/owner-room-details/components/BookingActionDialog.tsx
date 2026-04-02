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
	if (!isOpen || !booking) return null;

	return (
		<div className="fixed inset-0 z-50 h-full flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm">
			<div className="w-full max-w-sm space-y-6 rounded-2xl bg-surface-container-lowest p-6 shadow-2xl">
				<div className="space-y-2">
					<h2 className="text-xl font-semibold text-slate-900">
						Confirmar {action == "approve" ? "aprobación" : "rechazo"} de
						reserva
					</h2>
					<p className="text-sm text-slate-600">
						¿Estás seguro de que deseas{" "}
						{action == "approve" ? "aprobar" : "rechazar"} esta solicitud de
						reserva?
					</p>
				</div>

				<div className="space-y-3 rounded-lg bg-surface-container-low p-4">
					<div>
						<p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
							Nombre del solicitante
						</p>
						<p className="text-slate-900 font-semibold">{booking.bookerName}</p>
					</div>
					<div>
						<p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
							Correo electrónico
						</p>
						<p className="text-slate-900">{booking.bookerEmail}</p>
					</div>
					<div className="pt-2">
						<p className="text-xs text-slate-600">
							{action == "approve"
								? "Una vez aprobada, esta reserva será confirmada y todas las demás solicitudes pendientes serán rechazadas."
								: "Una vez rechazada, el usuario ya no podrá solicitar esta habitación."}
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
						Cancelar
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={isLoading}
						className={
							"flex-1 rounded-full px-4 py-2 font-medium text-on-primary transition disabled:cursor-not-allowed disabled:opacity-60 " +
							(action == "approve"
								? "bg-primary hover:bg-primary-container"
								: "bg-red-800 hover:bg-red-500")
						}
					>
						{isLoading
							? "Un momento..."
							: action == "approve"
								? "Aprobar"
								: "Rechazar"}
					</button>
				</div>
			</div>
		</div>
	);
}
