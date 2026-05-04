import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { DragEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import roomService from "../../../services/roomService";
import { RoomDetailsStep } from "../components/RoomDetailsStep";
import { RoomPreviewStep } from "../components/roomPreviewStep";
import { ServicesPoliciesStep } from "../components/ServicesPoliciesStep";
import { WizardProgress } from "../components/WizardProgress";
import {
	type CreateRoomFormOutput,
	type CreateRoomFormValues,
	createRoomSchema,
} from "../shared/createRoomSchema";
import { MAX_IMAGES, type MapPosition } from "../shared/roomWizardConfig";
import { useRoomDraftStore } from "../store/roomDraftStore";
import type { CreateRoomDto } from "../types/createRoomDto";

export function NewRoomPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [imageFiles, setImageFiles] = useState<File[]>([]);
	const [isDragging, setIsDragging] = useState(false);
	const [policyValidationError, setPolicyValidationError] = useState<
		string | null
	>(null);

	const {
		currentStep,
		name,
		description,
		price,
		roomStatus,
		location,
		imageFileNames,
		selectedServices,
		policies,
		actions,
	} = useRoomDraftStore((state) => state);

	const [selectedPosition, setSelectedPosition] = useState<MapPosition | null>(
		location,
	);

	const {
		register,
		handleSubmit,
		trigger,
		resetField,
		setValue,
		control,
		formState: { errors },
	} = useForm<CreateRoomFormValues, unknown, CreateRoomFormOutput>({
		resolver: zodResolver(createRoomSchema),
		defaultValues: {
			name,
			description,
			price: price ?? undefined,
			roomStatus,
			latitude: location?.lat,
			longitude: location?.lng,
		},
	});

	const watchedName = useWatch({ control, name: "name" });
	const watchedDescription = useWatch({ control, name: "description" });
	const watchedPrice = useWatch({ control, name: "price" });
	const watchedRoomStatus = useWatch({ control, name: "roomStatus" });
	const watchedLatitude = useWatch({ control, name: "latitude" });
	const watchedLongitude = useWatch({ control, name: "longitude" });

	useEffect(() => {
		actions.setDetails({
			name: watchedName ?? "",
			description: watchedDescription ?? "",
			price:
				typeof watchedPrice === "number" && !Number.isNaN(watchedPrice)
					? watchedPrice
					: null,
			roomStatus:
				typeof watchedRoomStatus === "number" ? watchedRoomStatus : roomStatus,
		});
	}, [
		actions,
		roomStatus,
		watchedDescription,
		watchedName,
		watchedPrice,
		watchedRoomStatus,
	]);

	useEffect(() => {
		if (
			typeof watchedLatitude === "number" &&
			typeof watchedLongitude === "number"
		) {
			const nextLocation = { lat: watchedLatitude, lng: watchedLongitude };
			setSelectedPosition(nextLocation);
			actions.setLocation(nextLocation);
			return;
		}

		setSelectedPosition(null);
		actions.setLocation(null);
	}, [actions, watchedLatitude, watchedLongitude]);

	useEffect(() => {
		actions.setImageFileNames(imageFiles.map((file) => file.name));
	}, [actions, imageFiles]);

	const previews = useMemo(() => {
		return imageFiles.map((file) => URL.createObjectURL(file));
	}, [imageFiles]);

	useEffect(() => {
		return () => {
			previews.forEach((preview) => URL.revokeObjectURL(preview));
		};
	}, [previews]);

	const mutation = useMutation({
		mutationFn: (dto: CreateRoomDto) => roomService.createRoom(dto),
		onSuccess: () => {
			actions.clearDraft();
			setImageFiles([]);
			toast.success(t("newRoom.successToast"));
			navigate("/");
		},
		onError: (error: Error) => {
			toast.error(t("newRoom.errorToast", { message: error.message }));
		},
	});

	const addFiles = (incoming: FileList | File[]) => {
		const valid = Array.from(incoming).filter((file) =>
			file.type.startsWith("image/"),
		);
		setImageFiles((prev) => [...prev, ...valid].slice(0, MAX_IMAGES));
	};

	const removeImage = (index: number) => {
		setImageFiles((prev) =>
			prev.filter((_, imageIndex) => imageIndex !== index),
		);
	};

	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
		setIsDragging(true);
	};
	const handleDragLeave = () => setIsDragging(false);
	const handleDrop = (event: DragEvent) => {
		event.preventDefault();
		setIsDragging(false);
		addFiles(event.dataTransfer.files);
	};

	const goToStep = (step: number) => {
		actions.setCurrentStep(step);
	};

	const handleCancel = () => {
		const hasUnsavedDraft = Boolean(
			name ||
				description ||
				price !== null ||
				location ||
				selectedServices.length > 0 ||
				policies.length > 0 ||
				imageFiles.length > 0 ||
				imageFileNames.length > 0,
		);

		if (!hasUnsavedDraft || window.confirm(t("newRoom.cancelConfirmMessage"))) {
			actions.clearDraft();
			setImageFiles([]);
			navigate("/");
		}
	};

	const handleNextFromDetails = async () => {
		const isValid = await trigger([
			"name",
			"description",
			"price",
			"roomStatus",
			"latitude",
			"longitude",
		]);
		if (!isValid) return;
		goToStep(1);
	};

	const handleNextFromServices = () => {
		const hasInvalidPolicy = policies.some(
			(policy) => !policy.description.trim(),
		);
		if (hasInvalidPolicy) {
			setPolicyValidationError(t("newRoom.policyDescriptionRequired"));
			return;
		}
		setPolicyValidationError(null);
		goToStep(2);
	};

	const onSubmit = (values: CreateRoomFormOutput) => {
		const dto: CreateRoomDto = {
			name: values.name,
			description: values.description,
			price: values.price,
			roomStatus: values.roomStatus,
			latitude: values.latitude,
			longitude: values.longitude,
			imageRoomFiles: imageFiles,
			services: selectedServices,
			policies: policies.map((policy) => ({
				id: policy.id,
				description: policy.description.trim(),
			})),
		};

		mutation.mutate(dto);
	};

	const previewValues: CreateRoomFormOutput = {
		name: watchedName ?? "",
		description: watchedDescription ?? "",
		price: typeof watchedPrice === "number" ? watchedPrice : 0,
		roomStatus: typeof watchedRoomStatus === "number" ? watchedRoomStatus : 1,
		latitude:
			typeof watchedLatitude === "number" ? watchedLatitude : Number.NaN,
		longitude:
			typeof watchedLongitude === "number" ? watchedLongitude : Number.NaN,
	};

	return (
		<div className="mx-auto w-full max-w-full space-y-4">
			<div className="flex flex-col gap-4 md:flex-row md:gap-6">
				<WizardProgress currentStep={currentStep} />

				<div className="min-w-0 flex-1 space-y-4">
					<div>
						<button
							type="button"
							onClick={handleCancel}
							className="mb-4 flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-700"
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
							{t("newRoom.backButton")}
						</button>
						<h1 className="text-2xl font-semibold text-slate-900">
							{t("newRoom.title")}
						</h1>
						<p className="mt-1 text-sm text-slate-500">
							{t("newRoom.subtitle")}
						</p>
					</div>

					<form
						onSubmit={handleSubmit(onSubmit)}
						noValidate
						className="space-y-5"
					>
						{currentStep === 0 && (
							<RoomDetailsStep
								register={register}
								setValue={setValue}
								resetField={resetField}
								errors={errors}
								selectedPosition={selectedPosition}
								setSelectedPosition={setSelectedPosition}
								imageFiles={imageFiles}
								previews={previews}
								persistedImageNames={imageFileNames}
								fileInputRef={fileInputRef}
								isDragging={isDragging}
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								onDrop={handleDrop}
								onAddFiles={addFiles}
								onRemoveImage={removeImage}
							/>
						)}

						{currentStep === 1 && (
							<ServicesPoliciesStep
								selectedServices={selectedServices}
								onChangeSelectedServices={actions.setSelectedServices}
								policies={policies}
								onChangePolicies={(nextPolicies) => {
									setPolicyValidationError(null);
									actions.setPolicies(nextPolicies);
								}}
								policyValidationError={policyValidationError}
							/>
						)}

						{currentStep === 2 && (
							<RoomPreviewStep
								values={previewValues}
								selectedServices={selectedServices}
								policies={policies}
								previews={previews}
								persistedImageNames={imageFileNames}
							/>
						)}

						<div className="flex items-center justify-end gap-3 pb-8">
							{currentStep === 0 && (
								<>
									<button
										type="button"
										onClick={handleCancel}
										className="rounded-full bg-surface-container-high px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-surface-container"
									>
										{t("newRoom.cancelButton")}
									</button>
									<button
										type="button"
										onClick={handleNextFromDetails}
										className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-on-primary transition hover:bg-primary-container"
									>
										{t("newRoom.nextButton")}
									</button>
								</>
							)}

							{currentStep === 1 && (
								<>
									<button
										type="button"
										onClick={() => goToStep(0)}
										className="rounded-full bg-surface-container-high px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-surface-container"
									>
										{t("newRoom.previousButton")}
									</button>
									<button
										type="button"
										onClick={handleNextFromServices}
										className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-on-primary transition hover:bg-primary-container"
									>
										{t("newRoom.previewButton")}
									</button>
								</>
							)}

							{currentStep === 2 && (
								<>
									<button
										type="button"
										onClick={() => goToStep(1)}
										className="rounded-full bg-surface-container-high px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-surface-container"
									>
										{t("newRoom.previousButton")}
									</button>
									<button
										type="submit"
										disabled={mutation.isPending}
										className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-on-primary transition hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
									>
										{mutation.isPending
											? t("newRoom.submitPending")
											: t("newRoom.submitButton")}
									</button>
								</>
							)}
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
