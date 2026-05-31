import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	AdvancedMarker,
	Map as GoogleMap,
	Pin,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { toast } from "sonner";
import UserPlaceholder from "../../../assets/user_image_placeholder.jfif";
import { RoomStatusEnum } from "../../../global/enum/room-status";
import bookingService from "../../../services/bookingService";
import roomService from "../../../services/roomService";
import {
	ROOM_POLICY_OPTIONS,
	ROOM_SERVICE_OPTIONS,
} from "../../new-room/shared/roomWizardConfig";

type ServiceOption = (typeof ROOM_SERVICE_OPTIONS)[number];
type PolicyOption = (typeof ROOM_POLICY_OPTIONS)[number];

const SERVICE_OPTION_BY_CODE = new Map<string, ServiceOption>(
	ROOM_SERVICE_OPTIONS.map((service) => [service.code, service]),
);

const POLICY_OPTION_BY_CODE = new Map<string, PolicyOption>(
	ROOM_POLICY_OPTIONS.map((policy) => [policy.code, policy]),
);

export function RoomDetails() {
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const queryClient = useQueryClient();
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [brokenImages, setBrokenImages] = useState<Set<number>>(new Set());
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

	const isCurrentBroken = brokenImages.has(selectedImageIndex);

	const userAlreadyBookedQuery = useQuery({
		queryKey: ["user-booking", id],
		queryFn: () => roomService.roomAlreadyBooked(id!),
		enabled: !!id,
	});

	useEffect(() => {
		if (room) {
			setBooked(room.roomStatus !== RoomStatusEnum.Available);
		}
	}, [room]);

	const bookingMutation = useMutation({
		mutationFn: () => bookingService.createBooking(String(room!.id)),
		onSuccess: () => {
			toast.success(t("roomDetails.bookSuccess"));
			setBookRequestSent(1);
			queryClient.invalidateQueries({ queryKey: ["user-booking", id] });
		},
		onError: (error: Error) => {
			toast.error(t("roomDetails.bookError", { message: error.message }));
		},
	});

	const bookingDeletion = useMutation({
		mutationFn: () => bookingService.deleteBooking(String(room!.id)),
		onSuccess: () => {
			toast.success(t("roomDetails.deleteSuccess"));
			setBookRequestSent(0);
			queryClient.invalidateQueries({ queryKey: ["user-booking", id] });
		},
		onError: (error: Error) => {
			toast.error(t("roomDetails.deleteError", { message: error.message }));
		},
	});

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-24 text-slate-500 text-sm">
				{t("roomDetails.loading")}
			</div>
		);
	}

	if (isError || !room) {
		return (
			<div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-tertiary shadow-sm">
				{t("roomDetails.loadError")}
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

	const handleImageError = () => {
		setBrokenImages((prev) => new Set(prev).add(selectedImageIndex));
	};

	const formattedPrice = new Intl.NumberFormat("es-BO", {
		style: "currency",
		currency: "BOB",
	}).format(room.price);

	const services = room.services ?? [];
	const policies = room.policies ?? [];

	return (
		<div className="space-y-8">
			<section className="surface-card overflow-hidden rounded-2xl">
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
							{t("roomDetails.noImage")}
						</div>
					)}

					{images.length > 1 && (
						<>
							<button
								onClick={prevImage}
								className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-surface-container-lowest/80 p-2 text-slate-800 backdrop-blur-sm transition hover:bg-surface-container-lowest"
								aria-label={t("roomDetails.prevImage")}
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
								aria-label={t("roomDetails.nextImage")}
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
										aria-label={t("roomDetails.viewImage", { n: index + 1 })}
									/>
								))}
							</div>
						</>
					)}
				</div>

				<div className="p-8 space-y-6">
					<div className="space-y-3">
						<h1 className="text-4xl font-bold text-slate-900">{room.name}</h1>
						<div className="inline-block rounded-full bg-primary px-4 py-2 text-lg font-semibold text-on-primary">
							{formattedPrice}
							{t("roomDetails.perMonth")}
						</div>
					</div>

					<div className="space-y-2">
						<h2 className="text-lg font-semibold text-slate-900">
							{t("roomDetails.descriptionTitle")}
						</h2>
						<p className="text-slate-600 leading-relaxed">{room.description}</p>
					</div>

					<div>
						<GoogleMap
							mapId={import.meta.env.VITE_GOOGLE_MAPS_ID}
							style={{ height: "400px", width: "100%" }}
							defaultCenter={{ lat: room.latitude, lng: room.longitude }}
							defaultZoom={15}
							gestureHandling="cooperative"
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

					<section className="space-y-3">
						<h2 className="text-lg font-semibold text-slate-900">
							{t("roomDetails.servicesTitle")}
						</h2>
						{services.length === 0 ? (
							<p className="text-sm text-slate-500">
								{t("roomDetails.servicesEmpty")}
							</p>
						) : (
							<div className="grid gap-3 sm:grid-cols-2">
								{services.map((code) => {
									const serviceOption = SERVICE_OPTION_BY_CODE.get(code);
									const label = serviceOption
										? t(serviceOption.labelKey)
										: code;
									const description = serviceOption
										? t(serviceOption.descriptionKey)
										: "";
									return (
										<div
											key={code}
											className="rounded-lg border border-slate-200 bg-white px-4 py-3"
										>
											<div className="flex items-center gap-2">
												{serviceOption?.icon && (
													<img
														src={serviceOption.icon}
														alt=""
														className="h-4 w-4 brightness-0"
														aria-hidden="true"
													/>
												)}
												<p className="text-sm font-semibold text-slate-800">
													{label}
												</p>
											</div>
											{description && (
												<p className="mt-1 text-sm text-slate-600">
													{description}
												</p>
											)}
										</div>
									);
								})}
							</div>
						)}
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-semibold text-slate-900">
							{t("roomDetails.policiesTitle")}
						</h2>
						{policies.length === 0 ? (
							<p className="text-sm text-slate-500">
								{t("roomDetails.policiesEmpty")}
							</p>
						) : (
							<div className="grid gap-3 sm:grid-cols-2">
								{policies.map((policy, index) => {
									const policyOption = POLICY_OPTION_BY_CODE.get(policy.code);
									const label = policyOption
										? t(policyOption.labelKey)
										: policy.code;
									return (
										<div
											key={`${policy.code}-${index}`}
											className="rounded-lg border border-slate-200 bg-white px-4 py-3"
										>
											<div className="flex items-center gap-2">
												{policyOption?.icon && (
													<img
														src={policyOption.icon}
														alt=""
														className="h-4 w-4 brightness-0"
														aria-hidden="true"
													/>
												)}
												<p className="text-sm font-semibold text-slate-800">
													{label}
												</p>
											</div>
											<p className="mt-1 text-sm text-slate-600">
												{policy.description}
											</p>
										</div>
									);
								})}
							</div>
						)}
					</section>

					<div className="pt-6">
						<div className="flex items-center gap-4">
							<img
								src={UserPlaceholder}
								alt={`${room.firstName} ${room.lastName}`}
								className="h-14 w-14 rounded-full object-cover"
							/>
							<div>
								<p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
									{t("roomDetails.ownerTitle")}
								</p>
								<p className="text-lg font-semibold text-slate-900">
									{room.firstName} {room.lastName}
								</p>
								<p className="text-sm text-slate-500">{room.email}</p>
								<p className="text-sm text-slate-500">{room.phoneNumber}</p>
							</div>
						</div>
					</div>

					<div className="pt-6 flex gap-3">
						{booked ? (
							<button
								type="button"
								disabled={true}
								className="flex-1 rounded-full bg-primary py-3 font-semibold text-on-primary transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
							>
								{t("roomDetails.notAvailable")}
							</button>
						) : bookRequestSent || userAlreadyBookedQuery.data ? (
							<button
								type="button"
								className="flex-1 rounded-full bg-secondary-fixed py-3 font-semibold text-red-800 transition hover:bg-red-800 hover:text-white"
								onClick={() => bookingDeletion.mutate()}
							>
								{t("roomDetails.deleteRequest")}
							</button>
						) : (
							<button
								type="button"
								disabled={
									bookingMutation.isPending || userAlreadyBookedQuery.data
								}
								className="flex-1 rounded-full bg-primary py-3 font-semibold text-on-primary transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
								onClick={() => bookingMutation.mutate()}
							>
								{bookingMutation.isPending
									? t("roomDetails.bookPending")
									: t("roomDetails.bookButton")}
							</button>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
