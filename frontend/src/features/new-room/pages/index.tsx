import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { DragEvent } from "react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import roomService from "../../../services/roomService";
import type { CreateRoomDto } from "../types/createRoomDto";

const MAX_IMAGES = 5;

const ROOM_STATUS_OPTIONS = [
	{ value: 1, label: "Available" },
	{ value: 2, label: "Unavailable" },
	{ value: 3, label: "Booked" },
] as const;

const createRoomSchema = z.object({
	name: z.string().trim().min(1, "Room name is required"),
	description: z.string().trim().min(1, "Description is required"),
	price: z.coerce
		.number({ error: "Price is required" })
		.positive("Price must be greater than 0"),
	roomStatus: z.coerce.number().int().min(1).max(3),
	latitude: z.coerce
		.number({ error: "Latitude is required" })
		.min(-90, "Latitude must be between -90 and 90")
		.max(90, "Latitude must be between -90 and 90"),
	longitude: z.coerce
		.number({ error: "Longitude is required" })
		.min(-180, "Longitude must be between -180 and 180")
		.max(180, "Longitude must be between -180 and 180"),
});

type CreateRoomFormValues = z.input<typeof createRoomSchema>;
type CreateRoomFormOutput = z.output<typeof createRoomSchema>;

export function NewRoomPage() {
	const navigate = useNavigate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [imageFiles, setImageFiles] = useState<File[]>([]);
	const [previews, setPreviews] = useState<string[]>([]);
	const [isDragging, setIsDragging] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateRoomFormValues, unknown, CreateRoomFormOutput>({
		resolver: zodResolver(createRoomSchema),
		defaultValues: { roomStatus: 1 },
	});

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
			toast.success("Room created successfully!");
			navigate("/");
		},
		onError: (error: Error) => {
			toast.error(error.message ?? "Failed to create room. Please try again.");
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
					Back to home
				</button>
				<h1 className="text-2xl font-semibold text-slate-900">
					Create a new room
				</h1>
				<p className="mt-1 text-sm text-slate-500">
					Fill in the details below to publish your room for students.
				</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
				{/* Section: Room Details */}
				<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
					<h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
						Room details
					</h2>

					{/* Name */}
					<div className="space-y-1.5">
						<label
							htmlFor="name"
							className="block text-sm font-medium text-slate-700"
						>
							Room name
						</label>
						<input
							id="name"
							type="text"
							placeholder="e.g. Cozy single room near campus"
							{...register("name")}
							className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
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
							Description
						</label>
						<textarea
							id="description"
							rows={4}
							placeholder="Describe the room, amenities, rules, nearby places…"
							{...register("description")}
							className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
						/>
						{errors.description && (
							<p className="text-xs text-red-600">
								{errors.description.message}
							</p>
						)}
					</div>
				</section>

				{/* Section: Pricing & Availability */}
				<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
					<h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
						Pricing & availability
					</h2>

					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
						{/* Price */}
						<div className="space-y-1.5">
							<label
								htmlFor="price"
								className="block text-sm font-medium text-slate-700"
							>
								Monthly price (BOB)
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
									className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
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
								Status
							</label>
							<select
								id="roomStatus"
								{...register("roomStatus")}
								className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
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
				<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
					<h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
						Location
					</h2>
					<p className="text-xs text-slate-500 -mt-2">
						Enter the GPS coordinates of the room. You can find them using
						Google Maps or a similar service.
					</p>

					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
						{/* Latitude */}
						<div className="space-y-1.5">
							<label
								htmlFor="latitude"
								className="block text-sm font-medium text-slate-700"
							>
								Latitude
							</label>
							<input
								id="latitude"
								type="number"
								step="0.000001"
								min="-90.000000"
								max="90.000000"
								placeholder="e.g. -17.3835"
								{...register("latitude")}
								className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
							/>
							{errors.latitude && (
								<p className="text-xs text-red-600">
									{errors.latitude.message}
								</p>
							)}
						</div>

						{/* Longitude */}
						<div className="space-y-1.5">
							<label
								htmlFor="longitude"
								className="block text-sm font-medium text-slate-700"
							>
								Longitude
							</label>
							<input
								id="longitude"
								type="number"
								step="0.000001"
								min="-180.000000"
								max="180.000000"
								placeholder="e.g. -66.1568"
								{...register("longitude")}
								className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
							/>
							{errors.longitude && (
								<p className="text-xs text-red-600">
									{errors.longitude.message}
								</p>
							)}
						</div>
					</div>
				</section>

				{/* Section: Images */}
				<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
					<div>
						<h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
							Images
						</h2>
						<p className="mt-1 text-xs text-slate-500">
							Up to {MAX_IMAGES} images. Optional.
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
							className={`w-full rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
								isDragging
									? "border-blue-400 bg-blue-50"
									: "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"
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
								{isDragging ? "Drop images here" : "Drag & drop images here"}
							</p>
							<p className="mt-1 text-xs text-slate-500">
								or{" "}
								<span className="text-blue-600 underline underline-offset-2">
									click to browse
								</span>
							</p>
							<p className="mt-2 text-xs text-slate-400">
								PNG, JPG, WEBP — {imageFiles.length}/{MAX_IMAGES} added
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
									className="group relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
								>
									<img
										src={src}
										alt={`Preview ${index + 1}`}
										className="h-full w-full object-cover"
									/>
									<button
										type="button"
										onClick={() => removeImage(index)}
										aria-label={`Remove image ${index + 1}`}
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
						className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={mutation.isPending}
						className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{mutation.isPending ? "Creating…" : "Create room"}
					</button>
				</div>
			</form>
		</div>
	);
}
