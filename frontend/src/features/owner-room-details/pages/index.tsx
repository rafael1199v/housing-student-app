import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { BookingStatusEnum } from "../../../global/enum/booking-status";
import bookingService from "../../../services/bookingService";
import roomService from "../../../services/roomService";
import { Footer } from "../../shared/components/footer";
import { BookingActionDialog } from "../components/BookingActionDialog";
import type { BookingDto } from "../types/roomHouseholderDetailDto";

export function OwnerRoomDetailsPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [brokenImages, setBrokenImages] = useState<Set<number>>(new Set());
	const [selectedBooking, setSelectedBooking] = useState<BookingDto | null>(
		null,
	);
	const [bookingAction, setBookingAction] = useState("approve");
	const [showDialog, setShowDialog] = useState(false);

	const {
		data: room,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["owner-room", id],
		queryFn: () => roomService.getHouseholderRoomDetail(id!),
		enabled: !!id,
	});
	const isCurrentBroken = brokenImages.has(selectedImageIndex);

	const approveMutation = useMutation({
		mutationFn: () => bookingService.approveBooking(selectedBooking!.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["owner-room", id] });
			toast.success("Reserva aprobada exitosamente.");
			setShowDialog(false);
			setSelectedBooking(null);
		},
		onError: () => {
			toast.error("Error al aprobar la reserva. Por favor, intenta de nuevo.");
		},
	});

	const rejectMutation = useMutation({
		mutationFn: () => bookingService.rejectBooking(selectedBooking!.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["owner-room", id] });
			toast.success("Reserva rechazada exitosamente.");
			setShowDialog(false);
			setSelectedBooking(null);
		},
		onError: () => {
			toast.error("Error al rechazar la reserva. Por favor, intenta de nuevo.");
		},
	});

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-24 text-slate-500 text-sm">
				Cargando detalles de la habitación...
			</div>
		);
	}

	if (isError || !room) {
		return (
			<div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-tertiary shadow-sm">
				No se pudieron cargar los detalles de la habitación. Por favor, intenta
				de nuevo más tarde.
			</div>
		);
	}

	const images = room.imageRoomUrls ?? [];
	const pendingBookings = room.bookings;
	const hasConfirmedBooking = pendingBookings.some(
		(booking) => booking.bookingStatus === "Confirmed",
	);

	const nextImage = () => {
		setSelectedImageIndex((prev) => (prev + 1) % images.length);
	};

	const prevImage = () => {
		setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
	};

	const handleImageError = () => {
		setBrokenImages((prev) => new Set(prev).add(selectedImageIndex));
	};

	const handleApproveClick = (booking: BookingDto) => {
		setSelectedBooking(booking);
		setBookingAction("approve");
		setShowDialog(true);
	};

	const handleRejectClick = (booking: BookingDto) => {
		setSelectedBooking(booking);
		setBookingAction("reject");
		setShowDialog(true);
	};

	const handleConfirmApproval = () => {
		approveMutation.mutate();
	};
	const handleRejectApproval = () => {
		rejectMutation.mutate();
	};

	const formattedPrice = new Intl.NumberFormat("es-BO", {
		style: "currency",
		currency: "BOB",
	}).format(room.price);

	return (
		<div className="space-y-8">
			<section className="surface-card overflow-hidden rounded-2xl">
				{/* Image carousel */}
				<div className="relative bg-surface-container-low">
					{images.length > 0 && !isCurrentBroken ? (
						<img
							src={images[selectedImageIndex]}
							alt={`${room.name} - Image ${selectedImageIndex + 1}`}
							className="w-full h-96 object-cover"
							onError={handleImageError}
						/>
					) : (
						<div className="w-full h-96 flex items-center justify-center text-sm text-slate-400">
							Sin imagen disponible
						</div>
					)}

					{images.length > 1 && (
						<>
							<button
								onClick={prevImage}
								className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-surface-container-lowest/80 p-2 text-slate-800 backdrop-blur-sm transition hover:bg-surface-container-lowest"
								aria-label="Imagen anterior"
							>
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 19l-7-7 7-7"
									/>
								</svg>
							</button>

							<button
								onClick={nextImage}
								className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-surface-container-lowest/80 p-2 text-slate-800 backdrop-blur-sm transition hover:bg-surface-container-lowest"
								aria-label="Siguiente imagen"
							>
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</button>

							<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
								{images.map((_, index) => (
									<button
										key={index}
										onClick={() => setSelectedImageIndex(index)}
										className={`h-2 w-2 rounded-full transition-all ${
											index === selectedImageIndex
												? "w-7 bg-surface-container-lowest"
												: "bg-surface-container-lowest/50 hover:bg-surface-container-lowest/80"
										}`}
										aria-label={`Ver imagen ${index + 1}`}
									/>
								))}
							</div>
						</>
					)}
				</div>

				<div className="p-8 space-y-6">
					{/* Room info */}
					<div className="space-y-3">
						<h1 className="text-4xl font-bold text-slate-900">{room.name}</h1>
						<div className="inline-block rounded-full bg-primary px-4 py-2 text-lg font-semibold text-on-primary">
							{formattedPrice}/mes
						</div>
						<div className="ml-3 inline-block rounded-full bg-surface-container-low px-4 py-2 text-sm font-semibold text-slate-700">
							Estado: {room.roomStatus}
						</div>
					</div>

					{/* Description */}
					<div className="space-y-2">
						<h2 className="text-lg font-semibold text-slate-900">
							Descripción
						</h2>
						<p className="text-slate-600 leading-relaxed">{room.description}</p>
					</div>

					{/* Pending bookings section */}
					<div className="pt-6">
						<h2 className="text-lg font-semibold text-slate-900 mb-4">
							Solicitudes de reserva pendientes
						</h2>

						{pendingBookings.length === 0 ? (
							<div className="rounded-lg bg-surface-container-low p-6 text-center text-slate-600">
								<p>No hay solicitudes de reserva pendientes en este momento.</p>
							</div>
						) : (
							<div className="space-y-3">
								{pendingBookings.map((booking) => (
									<div
										key={booking.id}
										className="flex items-start justify-between gap-4 rounded-lg bg-surface-container-low p-4 transition hover:bg-surface-container"
									>
										<div className="flex-1 space-y-2">
											<h3 className="font-semibold text-slate-900">
												{booking.bookerName}
											</h3>
											<p className="text-sm text-slate-600">
												{booking.bookerEmail}
											</p>
											{booking.bookingStatus == BookingStatusEnum.Confirmed ? (
												<div className="mt-1 inline-block rounded-full bg-green-200 px-2 py-1 text-xs font-medium text-on-secondary-fixed">
													{booking.bookingStatus}
												</div>
											) : booking.bookingStatus == BookingStatusEnum.Pending ? (
												<div className="mt-1 inline-block rounded-full bg-secondary-fixed px-2 py-1 text-xs font-medium text-on-secondary-fixed">
													{booking.bookingStatus}
												</div>
											) : booking.bookingStatus ==
												BookingStatusEnum.Rejected ? (
												<div className="mt-1 inline-block rounded-full bg-red-200 px-2 py-1 text-xs font-medium text-on-secondary-fixed">
													{booking.bookingStatus}
												</div>
											) : (
												<div className="mt-1 inline-block rounded-full bg-gray-300 px-2 py-1 text-xs font-medium text-on-secondary-fixed">
													{booking.bookingStatus}
												</div>
											)}
										</div>
										<button
											type="button"
											onClick={() => handleApproveClick(booking)}
											disabled={
												approveMutation.isPending ||
												rejectMutation.isPending ||
												hasConfirmedBooking ||
												booking.bookingStatus != BookingStatusEnum.Pending
											}
											className="whitespace-nowrap rounded-full bg-primary px-4 py-2 font-medium text-on-primary transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
										>
											Aprobar
										</button>
										<button
											type="button"
											onClick={() => handleRejectClick(booking)}
											disabled={
												approveMutation.isPending ||
												rejectMutation.isPending ||
												hasConfirmedBooking ||
												booking.bookingStatus != BookingStatusEnum.Pending
											}
											className="whitespace-nowrap rounded-full bg-red-800 px-4 py-2 font-medium text-on-primary transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
										>
											Rechazar
										</button>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Back button */}
					<div className="pt-6 flex gap-3">
						<button
							type="button"
							onClick={() => navigate("/")}
							className="flex-1 rounded-full bg-secondary-fixed py-3 font-semibold text-on-secondary-fixed transition hover:brightness-95"
						>
							Volver a mis habitaciones
						</button>
					</div>
				</div>
			</section>

			<BookingActionDialog
				booking={selectedBooking}
				action={bookingAction}
				isOpen={showDialog}
				isLoading={approveMutation.isPending}
				onConfirm={
					bookingAction == "approve"
						? handleConfirmApproval
						: handleRejectApproval
				}
				onCancel={() => {
					setShowDialog(false);
					setSelectedBooking(null);
				}}
			/>

			<Footer />
		</div>
	);
}
