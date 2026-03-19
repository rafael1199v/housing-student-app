import { useMutation, useQuery } from "@tanstack/react-query";
import {
	AdvancedMarker,
	Map as GoogleMap,
	Pin,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import roomService from "../../../services/roomService";
import { Footer } from "../../shared/components/footer";

export function RoomDetails() {
	const { id } = useParams<{ id: string }>();
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [bookRequestSent, setBookRequestSent] = useState(0);
	const [booked, setBooked] = useState(false);

	const {
		data: room,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["room", id],
		queryFn: () => roomService.getRoomById(id!),
		enabled: !!id,
	});

	useEffect(() => {
		if (room) {
			setBooked(room.roomStatus !== "Available");
		}
	}, [room]);
	//TODO: hacer un GET para verificar si ya existe una reservación de esta habitación por el mismo estudiante
	//TODO: Mostrar datos de contacto si el booking fue confirmado!

	const bookingMutation = useMutation({
		mutationFn: () => roomService.createBooking(String(room!.id)),
		onSuccess: () => {
			toast.success("Reserva realizada con éxito.");
			setBookRequestSent(1);
		},
		onError: () => {
			toast.error("Error al realizar la reserva. Por favor, intenta de nuevo.");
		},
	});

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-24 text-slate-500 text-sm">
				Cargando habitación...
			</div>
		);
	}

	if (isError || !room) {
		return (
			<div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-red-700">
				No se pudo cargar la habitación. Por favor, intenta de nuevo más tarde.
			</div>
		);
	}

	const images = room.imageRoomUrls ?? [];

	const nextImage = () => {
		setSelectedImageIndex((prev) => (prev + 1) % images.length);
	};

	const prevImage = () => {
		setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
	};

	const formattedPrice = new Intl.NumberFormat("es-BO", {
		style: "currency",
		currency: "BOB",
	}).format(room.price);

	return (
		<div className="space-y-8">
			<section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
				<div className="relative bg-slate-100">
					{images.length > 0 ? (
						<img
							src={images[selectedImageIndex]}
							alt={`${room.name} - Image ${selectedImageIndex + 1}`}
							className="w-full h-96 object-cover"
						/>
					) : (
						<div className="w-full h-96 flex items-center justify-center text-sm text-slate-400">
							Sin imágenes disponibles
						</div>
					)}

					{images.length > 1 && (
						<>
							<button
								onClick={prevImage}
								className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
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
								className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
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
										className={`w-3 h-3 rounded-full transition-all ${
											index === selectedImageIndex
												? "bg-white w-8"
												: "bg-white/60 hover:bg-white/80"
										}`}
										aria-label={`Ver imagen ${index + 1}`}
									/>
								))}
							</div>
						</>
					)}
				</div>

				<div className="p-8 space-y-6">
					<div className="space-y-3">
						<h1 className="text-4xl font-bold text-slate-900">{room.name}</h1>
						<div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-lg">
							{formattedPrice}/mes
						</div>
					</div>

					<div className="space-y-2">
						<h2 className="text-lg font-semibold text-slate-900">
							Descripción
						</h2>
						<p className="text-slate-600 leading-relaxed">{room.description}</p>
					</div>

					<div>
						<GoogleMap
							mapId={"ede7684c941ba061c27c52d4"}
							style={{ height: "400px", width: "100%" }}
							defaultCenter={{ lat: room.latitude, lng: room.longitude }}
							defaultZoom={15}
							gestureHandling="greedy"
						>
							<AdvancedMarker
								position={{ lat: room.latitude, lng: room.longitude }}
							>
								<Pin
									background={"#0f9d58"}
									borderColor={"#006425"}
									glyphColor={"#60d98f"}
								/>
							</AdvancedMarker>
						</GoogleMap>
					</div>

					<div className="border-t border-slate-200 pt-6">
						<div className="flex items-center gap-4">
							{room.imageUrl ? (
								<img
									src={room.imageUrl}
									alt={`${room.firstName} ${room.lastName}`}
									className="w-14 h-14 rounded-full object-cover border border-slate-200"
								/>
							) : (
								<div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-lg font-semibold">
									{room.firstName.charAt(0)}
								</div>
							)}

							<div>
								<p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
									Dueño de la propiedad
								</p>
								<p className="text-lg font-semibold text-slate-900">
									{room.firstName} {room.lastName}
								</p>
								<p className="text-sm text-slate-500">{room.email}</p>
								<p className="text-sm text-slate-500">{room.phoneNumber}</p>
							</div>
						</div>
					</div>

					<div className="border-t border-slate-200 pt-6 flex gap-3">
						{booked ? (
							<button
								type="button"
								disabled={true}
								className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
							>
								Reserva no disponible, prueba a buscar otra habitación.
							</button>
						) : bookRequestSent ? (
							<button
								type="button"
								disabled={true}
								className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
							>
								Reservación solicitada!
							</button>
						) : (
							<button
								type="button"
								disabled={bookingMutation.isPending}
								className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
								onClick={() => bookingMutation.mutate()}
							>
								{bookingMutation.isPending
									? "Reservando..."
									: "Reservar habitación"}
							</button>
						)}
					</div>
				</div>
			</section>
			<Footer />
		</div>
	);
}
