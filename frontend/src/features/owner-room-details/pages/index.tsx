import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import roomService from "../../../services/roomService";
import { Footer } from "../../shared/components/footer";
import { BookingApprovalDialog } from "../components/BookingApprovalDialog";
import type { BookingDto } from "../types/roomHouseholderDetailDto";

export function OwnerRoomDetailsPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [selectedBooking, setSelectedBooking] = useState<BookingDto | null>(
		null,
	);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);

	const {
		data: room,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["owner-room", id],
		queryFn: () => roomService.getHouseholderRoomDetail(id!),
		enabled: !!id,
	});

	const approveMutation = useMutation({
		mutationFn: () => roomService.approveBooking(selectedBooking!.id),
		onSuccess: () => {
			toast.success("Booking approved successfully.");
			setShowConfirmDialog(false);
			setSelectedBooking(null);
			setTimeout(() => navigate("/"), 1500);
		},
		onError: () => {
			toast.error("Error approving booking. Please try again.");
		},
	});

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-24 text-slate-500 text-sm">
				Loading room details...
			</div>
		);
	}

	if (isError || !room) {
		return (
			<div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-red-700">
				Could not load room details. Please try again later.
			</div>
		);
	}

	const images = room.imageRoomUrls ?? [];
	const pendingBookings = room.bookings;

	const nextImage = () => {
		setSelectedImageIndex((prev) => (prev + 1) % images.length);
	};

	const prevImage = () => {
		setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
	};

	const handleApproveClick = (booking: BookingDto) => {
		setSelectedBooking(booking);
		setShowConfirmDialog(true);
	};

	const handleConfirmApproval = () => {
		approveMutation.mutate();
	};

	const formattedPrice = new Intl.NumberFormat("es-BO", {
		style: "currency",
		currency: "BOB",
	}).format(room.price);

	return (
		<div className="space-y-8">
			<section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
				{/* Image carousel */}
				<div className="relative bg-slate-100">
					{images.length > 0 ? (
						<img
							src={images[selectedImageIndex]}
							alt={`${room.name} - Image ${selectedImageIndex + 1}`}
							className="w-full h-96 object-cover"
						/>
					) : (
						<div className="w-full h-96 flex items-center justify-center text-sm text-slate-400">
							No images available
						</div>
					)}

					{images.length > 1 && (
						<>
							<button
								onClick={prevImage}
								className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
								aria-label="Previous image"
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
								className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
								aria-label="Next image"
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
										className={`w-3 h-3 rounded-full transition-all ${
											index === selectedImageIndex
												? "bg-white w-8"
												: "bg-white/60 hover:bg-white/80"
										}`}
										aria-label={`View image ${index + 1}`}
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
						<div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-lg">
							{formattedPrice}/month
						</div>
						<div className="inline-block ml-3 px-4 py-2 rounded-lg font-semibold text-sm bg-slate-100 text-slate-700">
							Status: {room.roomStatus}
						</div>
					</div>

					{/* Description */}
					<div className="space-y-2">
						<h2 className="text-lg font-semibold text-slate-900">
							Description
						</h2>
						<p className="text-slate-600 leading-relaxed">{room.description}</p>
					</div>

					{/* Pending bookings section */}
					<div className="border-t border-slate-200 pt-6">
						<h2 className="text-lg font-semibold text-slate-900 mb-4">
							Pending Booking Requests
						</h2>

						{pendingBookings.length === 0 ? (
							<div className="bg-slate-50 rounded-lg p-6 text-center text-slate-600">
								<p>No pending booking requests at this time.</p>
							</div>
						) : (
							<div className="space-y-3">
								{pendingBookings.map((booking) => (
									<div
										key={booking.id}
										className="flex items-start justify-between gap-4 p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition"
									>
										<div className="flex-1 space-y-2">
											<h3 className="font-semibold text-slate-900">
												{booking.bookerName}
											</h3>
											<p className="text-sm text-slate-600">
												{booking.bookerEmail}
											</p>
											<div className="inline-block mt-1 px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
												{booking.bookingStatus}
											</div>
										</div>
										<button
											type="button"
											onClick={() => handleApproveClick(booking)}
											disabled={approveMutation.isPending}
											className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors whitespace-nowrap"
										>
											Approve
										</button>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Back button */}
					<div className="border-t border-slate-200 pt-6 flex gap-3">
						<button
							type="button"
							onClick={() => navigate("/")}
							className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-3 rounded-lg transition-colors"
						>
							Back to My Rooms
						</button>
					</div>
				</div>
			</section>

			<BookingApprovalDialog
				booking={selectedBooking}
				isOpen={showConfirmDialog}
				isLoading={approveMutation.isPending}
				onConfirm={handleConfirmApproval}
				onCancel={() => {
					setShowConfirmDialog(false);
					setSelectedBooking(null);
				}}
			/>

			<Footer />
		</div>
	);
}
