import {
	AdvancedMarker,
	Map as GoogleMap,
	type MapMouseEvent,
	Pin,
} from "@vis.gl/react-google-maps";
import type { DragEvent, RefObject } from "react";
import type {
	FieldErrors,
	UseFormRegister,
	UseFormResetField,
	UseFormSetValue,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { CreateRoomFormValues } from "../shared/createRoomSchema";
import {
	DEFAULT_MAP_CENTER,
	MAX_IMAGES,
	type MapPosition,
	ROOM_STATUS_OPTIONS,
} from "../shared/roomWizardConfig";

type RoomDetailsStepProps = {
	register: UseFormRegister<CreateRoomFormValues>;
	setValue: UseFormSetValue<CreateRoomFormValues>;
	resetField: UseFormResetField<CreateRoomFormValues>;
	errors: FieldErrors<CreateRoomFormValues>;
	selectedPosition: MapPosition | null;
	setSelectedPosition: (position: MapPosition | null) => void;
	imageFiles: File[];
	previews: string[];
	persistedImageNames: string[];
	existingImages?: { id: number; url: string }[];
	onRemoveExistingImage?: (id: number) => void;
	fileInputRef: RefObject<HTMLInputElement | null>;
	isDragging: boolean;
	onDragOver: (e: DragEvent) => void;
	onDragLeave: () => void;
	onDrop: (e: DragEvent) => void;
	onAddFiles: (incoming: FileList | File[]) => void;
	onRemoveImage: (index: number) => void;
};

export function RoomDetailsStep({
	register,
	setValue,
	resetField,
	errors,
	selectedPosition,
	setSelectedPosition,
	imageFiles,
	previews,
	persistedImageNames,
	existingImages = [],
	onRemoveExistingImage,
	fileInputRef,
	isDragging,
	onDragOver,
	onDragLeave,
	onDrop,
	onAddFiles,
	onRemoveImage,
}: RoomDetailsStepProps) {
	const { t } = useTranslation();
	const locationError = errors.latitude?.message ?? errors.longitude?.message;
	const totalImageCount = existingImages.length + imageFiles.length;

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

	return (
		<div className="space-y-5">
			<input type="hidden" {...register("latitude")} />
			<input type="hidden" {...register("longitude")} />

			<section className="surface-section space-y-5">
				<h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
					{t("newRoom.detailsSection")}
				</h2>

				<div className="space-y-1.5">
					<label
						htmlFor="name"
						className="block text-sm font-medium text-slate-700"
					>
						{t("newRoom.nameLabel")}
					</label>
					<input
						id="name"
						type="text"
						autoComplete="off"
						placeholder={t("newRoom.namePlaceholder")}
						{...register("name")}
						className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
					/>
					{errors.name && (
						<p className="text-xs text-red-600">{errors.name.message}</p>
					)}
				</div>

				<div className="space-y-1.5">
					<label
						htmlFor="description"
						className="block text-sm font-medium text-slate-700"
					>
						{t("newRoom.descriptionLabel")}
					</label>
					<textarea
						id="description"
						rows={4}
						placeholder={t("newRoom.descriptionPlaceholder")}
						{...register("description")}
						className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
					/>
					{errors.description && (
						<p className="text-xs text-red-600">{errors.description.message}</p>
					)}
				</div>
			</section>

			<section className="surface-section space-y-5">
				<h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
					{t("newRoom.pricingSection")}
				</h2>

				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
					<div className="space-y-1.5">
						<label
							htmlFor="price"
							className="block text-sm font-medium text-slate-700"
						>
							{t("newRoom.priceLabel")}
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
								{...register("price", { valueAsNumber: true })}
								className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
							/>
						</div>
						{errors.price && (
							<p className="text-xs text-red-600">{errors.price.message}</p>
						)}
					</div>

					<div className="space-y-1.5">
						<label
							htmlFor="roomStatus"
							className="block text-sm font-medium text-slate-700"
						>
							{t("newRoom.statusLabel")}
						</label>
						<select
							id="roomStatus"
							{...register("roomStatus", {
								setValueAs: (value) => Number(value),
							})}
							className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
						>
							{ROOM_STATUS_OPTIONS.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{t(opt.labelKey)}
								</option>
							))}
						</select>
					</div>
				</div>
			</section>

			<section className="surface-section space-y-5">
				<h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
					{t("newRoom.locationSection")}
				</h2>
				<p className="text-xs text-slate-500 -mt-2">
					{t("newRoom.locationHint")}
				</p>

				<div className="overflow-hidden rounded-xl border border-outline-variant/35">
					<GoogleMap
						mapId={import.meta.env.VITE_GOOGLE_MAPS_ID}
						style={{ height: "360px", width: "100%" }}
						defaultCenter={DEFAULT_MAP_CENTER}
						defaultZoom={13}
						gestureHandling="cooperative"
						fullscreenControl={false}
						onClick={handleMapClick}
					>
						{selectedPosition && (
							<AdvancedMarker position={selectedPosition}>
								<Pin
									background="#0f9d58"
									borderColor="#006425"
									glyphColor="#60d98f"
								/>
							</AdvancedMarker>
						)}
					</GoogleMap>
				</div>

				<div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
					{selectedPosition ? (
						<p>
							{t("newRoom.locationSelected", {
								latitude: selectedPosition.lat.toFixed(6),
								longitude: selectedPosition.lng.toFixed(6),
							})}
						</p>
					) : (
						<p>{t("newRoom.noLocation")}</p>
					)}

					{selectedPosition && (
						<button
							type="button"
							onClick={() => {
								setSelectedPosition(null);
								resetField("latitude", { keepDirty: true });
								resetField("longitude", { keepDirty: true });
							}}
							className="text-primary underline underline-offset-2"
						>
							{t("newRoom.removeMarker")}
						</button>
					)}
				</div>
				{locationError && (
					<p className="text-xs text-red-600">{locationError}</p>
				)}
			</section>

			<section className="surface-section space-y-5">
				<div>
					<h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
						{t("newRoom.imagesSection")}
					</h2>
					<p className="mt-1 text-xs text-slate-500">
						{t("newRoom.imagesLimit", { max: MAX_IMAGES })}
					</p>
				</div>

				{totalImageCount < MAX_IMAGES && (
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						onDragOver={onDragOver}
						onDragLeave={onDragLeave}
						onDrop={onDrop}
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
							{isDragging ? t("newRoom.dropDragging") : t("newRoom.dropIdle")}
						</p>
						<p className="mt-1 text-xs text-slate-500">
							o{" "}
							<span className="text-primary underline underline-offset-2">
								{t("newRoom.dropClickText")}
							</span>
						</p>
						<p className="mt-2 text-xs text-slate-400">
							{t("newRoom.dropFormats", {
								count: totalImageCount,
								max: MAX_IMAGES,
							})}
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
						if (e.target.files) onAddFiles(e.target.files);
						e.target.value = "";
					}}
				/>

				{existingImages.length > 0 && (
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
						{existingImages.map((image, index) => (
							<div
								key={image.id}
								className="group relative aspect-video overflow-hidden rounded-xl bg-surface-container-low"
							>
								<img
									src={image.url}
									alt={t("newRoom.imagePreviewAlt", { n: index + 1 })}
									className="h-full w-full object-cover"
								/>
								<button
									type="button"
									onClick={() => onRemoveExistingImage?.(image.id)}
									aria-label={t("newRoom.removeExistingImageAriaLabel", {
										n: index + 1,
									})}
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

				{previews.length > 0 && (
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
						{previews.map((src, index) => (
							<div
								key={imageFiles[index]?.name ?? index}
								className="group relative aspect-video overflow-hidden rounded-xl bg-surface-container-low"
							>
								<img
									src={src}
									alt={t("newRoom.imagePreviewAlt", { n: index + 1 })}
									className="h-full w-full object-cover"
								/>
								<button
									type="button"
									onClick={() => onRemoveImage(index)}
									aria-label={t("newRoom.removeImageAriaLabel", {
										n: index + 1,
									})}
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

				{imageFiles.length === 0 && persistedImageNames.length > 0 && (
					<div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
						<p>{t("newRoom.imagesNeedReattach")}</p>
						<p className="mt-1 text-amber-900">
							{persistedImageNames.join(", ")}
						</p>
					</div>
				)}
			</section>
		</div>
	);
}
