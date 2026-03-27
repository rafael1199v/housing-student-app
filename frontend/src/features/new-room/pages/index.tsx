import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
	AdvancedMarker,
	Map as GoogleMap,
	type MapMouseEvent,
	Pin,
} from "@vis.gl/react-google-maps";
import type { DragEvent } from "react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import roomService from "../../../services/roomService";
import type { CreateRoomDto } from "../types/createRoomDto";

const MAX_IMAGES = 5;
const DEFAULT_MAP_CENTER = { lat: -17.695442, lng: -63.150744 };

const ROOM_STATUS_OPTIONS = [
	{ value: 1, label: "Disponible" },
	{ value: 2, label: "No disponible" },
] as const;

const createRoomSchema = z.object({
	name: z.string().trim().min(1, "El nombre de la habitación es obligatorio"),
	description: z
		.string()
		.trim()
		.min(1, "La descripción es obligatoria")
		.max(300, "La descripción es demasiado larga"),
	price: z.coerce
		.number({ error: "El precio es obligatorio" })
		.positive("El precio debe ser mayor a 0")
		.max(99999, "El precio es demasiado alto"),
	roomStatus: z.coerce.number().int().min(1).max(3),
	latitude: z
		.number({ error: "Por favor, selecciona una ubicación en el mapa" })
		.min(-90, "La latitud debe estar entre -90 y 90")
		.max(90, "La latitud debe estar entre -90 y 90"),
	longitude: z
		.number({ error: "Por favor, selecciona una ubicación en el mapa" })
		.min(-180, "La longitud debe estar entre -180 y 180")
		.max(180, "La longitud debe estar entre -180 y 180"),
});

type CreateRoomFormValues = z.input<typeof createRoomSchema>;
type CreateRoomFormOutput = z.output<typeof createRoomSchema>;
type MapPosition = { lat: number; lng: number };

export function NewRoomPage() {
	const navigate = useNavigate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [imageFiles, setImageFiles] = useState<File[]>([]);
	const [previews, setPreviews] = useState<string[]>([]);
	const [isDragging, setIsDragging] = useState(false);
	const [selectedPosition, setSelectedPosition] = useState<MapPosition | null>(
		null,
	);

	const {
		register,
		handleSubmit,
		resetField,
		setValue,
		formState: { errors },
	} = useForm<CreateRoomFormValues, unknown, CreateRoomFormOutput>({
		resolver: zodResolver(createRoomSchema),
		defaultValues: { roomStatus: 1 },
	});

	const locationError = errors.latitude?.message ?? errors.longitude?.message;

	const handleMapClick = (event: MapMouseEvent) => {
		if (!event.detail.latLng) return;

		const position = {
			lat: event.detail.latLng.lat,
			lng: event.detail.latLng.lng,
		};

		setSelectedPosition(position);
		setValue("latitude", position.lat, {
			shouldDirty: true,
			shouldValidate: true,
		});
		setValue("longitude", position.lng, {
			shouldDirty: true,
			shouldValidate: true,
		});
	};

	const addFiles = (incoming: FileList | File[]) => {
		const valid = Array.from(incoming).filter((f) =>
			f.type.startsWith("image/"),
		);
		setImageFiles((prev) => {
			const merged = [...prev, ...valid].slice(0, MAX_IMAGES);
			// Rebuild previews in sync
			setPreviews(merged.map((f) => URL.createObjectURL(f)));
			return merged;
		});
	};

	const removeImage = (index: number) => {
		setImageFiles((prev) => {
			const next = prev.filter((_, i) => i !== index);
			setPreviews(next.map((f) => URL.createObjectURL(f)));
			return next;
		});
	};

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};
	const handleDragLeave = () => setIsDragging(false);
	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		addFiles(e.dataTransfer.files);
	};

	const mutation = useMutation({
		mutationFn: (dto: CreateRoomDto) => roomService.createRoom(dto),
		onSuccess: () => {
			toast.success("¡Habitación creada exitosamente!");
			navigate("/");
		},
		onError: (error: Error) => {
			toast.error(
				error.message ??
					"Error al crear la habitación. Por favor, intenta de nuevo.",
			);
		},
	});

	const onSubmit = (values: CreateRoomFormOutput) => {
		const dto: CreateRoomDto = {
			name: values.name,
			description: values.description,
			price: values.price,
			roomStatus: values.roomStatus,
			latitude: values.latitude,
			longitude: values.longitude,
			imageRoomFiles: imageFiles,
		};
		mutation.mutate(dto);
	};

	return (
		<div className="mx-auto w-full max-w-2xl space-y-6">
			{/* Header */}
			<div>
				<button
					type="button"
					onClick={() => navigate("/")}
					className="mb-4 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="m15 18-6-6 6-6" />
					</svg>
					Volver al inicio
				</button>
				<h1 className="text-2xl font-semibold text-slate-900">
					Crear nueva habitación
				</h1>
				<p className="mt-1 text-sm text-slate-500">
					Completa los datos a continuación para publicar tu habitación para
					estudiantes.
				</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
				<input type="hidden" {...register("latitude")} />
				<input type="hidden" {...register("longitude")} />

				{/* Section: Room Details */}
				<section className="surface-section space-y-5">
					<h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
						Detalles de la habitación
					</h2>

					{/* Name */}
					<div className="space-y-1.5">
						<label
							htmlFor="name"
							className="block text-sm font-medium text-slate-700"
						>
							Nombre de la habitación
						</label>
						<input
							id="name"
							type="text"
							placeholder="Ej. Habitación individual cerca del campus"
							{...register("name")}
							className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
						/>
						{errors.name && (
							<p className="text-xs text-red-600">{errors.name.message}</p>
						)}
					</div>

					{/* Description */}
					<div className="space-y-1.5">
						<label
							htmlFor="description"
							className="block text-sm font-medium text-slate-700"
						>
							Descripción
						</label>
						<textarea
							id="description"
							rows={4}
							placeholder="Describe la habitación, servicios, reglas, lugares cercanos…"
							{...register("description")}
							className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
						/>
						{errors.description && (
							<p className="text-xs text-red-600">
								{errors.description.message}
							</p>
						)}
					</div>
				</section>

				{/* Section: Pricing & Availability */}
				<section className="surface-section space-y-5">
					<h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
						Precio y disponibilidad
					</h2>

					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
						{/* Price */}
						<div className="space-y-1.5">
							<label
								htmlFor="price"
								className="block text-sm font-medium text-slate-700"
							>
								Precio mensual (BOB)
							</label>
							<div className="relative">
								<span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm text-slate-400">
									Bs.
								</span>
								<input
									id="price"
									type="number"
									min="0"
									step="0.01"
									placeholder="0.00"
									{...register("price")}
									className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
								/>
							</div>
							{errors.price && (
								<p className="text-xs text-red-600">{errors.price.message}</p>
							)}
						</div>

						{/* Room Status */}
						<div className="space-y-1.5">
							<label
								htmlFor="roomStatus"
								className="block text-sm font-medium text-slate-700"
							>
								Estado
							</label>
							<select
								id="roomStatus"
								{...register("roomStatus")}
								className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
							>
								{ROOM_STATUS_OPTIONS.map((opt) => (
									<option key={opt.value} value={opt.value}>
										{opt.label}
									</option>
								))}
							</select>
							{errors.roomStatus && (
								<p className="text-xs text-red-600">
									{errors.roomStatus.message}
								</p>
							)}
						</div>
					</div>
				</section>

				{/* Section: Location */}
				<section className="surface-section space-y-5">
					<h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
						Ubicación
					</h2>
					<p className="text-xs text-slate-500 -mt-2">
						Haz clic en el mapa para colocar un marcador en la ubicación de la
						habitación.
					</p>

					<div className="overflow-hidden rounded-xl border border-outline-variant/35">
						<GoogleMap
							mapId={import.meta.env.VITE_GOOGLE_MAPS_ID}
							style={{ height: "360px", width: "100%" }}
							defaultCenter={DEFAULT_MAP_CENTER}
							defaultZoom={13}
							gestureHandling="greedy"
							onClick={handleMapClick}
						>
							{selectedPosition && (
								<AdvancedMarker position={selectedPosition}>
									<Pin
										background={"#0f9d58"}
										borderColor={"#006425"}
										glyphColor={"#60d98f"}
									/>
								</AdvancedMarker>
							)}
						</GoogleMap>
					</div>

					<div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
						{selectedPosition ? (
							<p>
								Ubicación seleccionada: {selectedPosition.lat.toFixed(6)},
								{selectedPosition.lng.toFixed(6)}
							</p>
						) : (
							<p>No se ha seleccionado ubicación.</p>
						)}

						{selectedPosition && (
							<button
								type="button"
								onClick={() => {
									setSelectedPosition(null);
									resetField("latitude", {
										keepDirty: true,
									});
									resetField("longitude", {
										keepDirty: true,
									});
								}}
								className="text-primary underline underline-offset-2"
							>
								Quitar marcador
							</button>
						)}
					</div>

					{locationError && (
						<p className="text-xs text-red-600">{locationError}</p>
					)}
				</section>

				{/* Section: Images */}
				<section className="surface-section space-y-5">
					<div>
						<h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
							Imágenes
						</h2>
						<p className="mt-1 text-xs text-slate-500">
							Hasta {MAX_IMAGES} imágenes. Opcional.
						</p>
					</div>

					{/* Drop zone — only shown when under the limit */}
					{imageFiles.length < MAX_IMAGES && (
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
							className={`w-full rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 ${
								isDragging
									? "border-primary/40 bg-surface-container"
									: "border-outline-variant/35 bg-surface-container-low hover:border-primary/40 hover:bg-surface-container"
							}`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
								className="mx-auto mb-3 text-slate-400"
							>
								<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
								<circle cx="9" cy="9" r="2" />
								<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
							</svg>
							<p className="text-sm font-medium text-slate-700">
								{isDragging
									? "Suelta las imágenes aquí"
									: "Arrastra y suelta imágenes aquí"}
							</p>
							<p className="mt-1 text-xs text-slate-500">
								o{" "}
								<span className="text-primary underline underline-offset-2">
									haz clic para explorar
								</span>
							</p>
							<p className="mt-2 text-xs text-slate-400">
								PNG, JPG, WEBP — {imageFiles.length}/{MAX_IMAGES} agregadas
							</p>
						</button>
					)}

					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						multiple
						className="sr-only"
						onChange={(e) => {
							if (e.target.files) addFiles(e.target.files);
							e.target.value = "";
						}}
					/>

					{/* Previews */}
					{previews.length > 0 && (
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
							{previews.map((src, index) => (
								<div
									key={imageFiles[index]?.name ?? index}
									className="group relative aspect-video overflow-hidden rounded-xl bg-surface-container-low"
								>
									<img
										src={src}
										alt={`Vista previa ${index + 1}`}
										className="h-full w-full object-cover"
									/>
									<button
										type="button"
										onClick={() => removeImage(index)}
										aria-label={`Eliminar imagen ${index + 1}`}
										className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/80 focus:opacity-100 focus:outline-none"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2.5"
											strokeLinecap="round"
											strokeLinejoin="round"
											aria-hidden="true"
										>
											<path d="M18 6 6 18" />
											<path d="m6 6 12 12" />
										</svg>
									</button>
								</div>
							))}
						</div>
					)}
				</section>

				{/* Actions */}
				<div className="flex items-center justify-end gap-3 pb-8">
					<button
						type="button"
						onClick={() => navigate("/")}
						className="rounded-full bg-surface-container-high px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-surface-container"
					>
						Cancelar
					</button>
					<button
						type="submit"
						disabled={mutation.isPending}
						className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-on-primary transition hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{mutation.isPending ? "Creando…" : "Crear habitación"}
					</button>
				</div>
			</form>
		</div>
	);
}
