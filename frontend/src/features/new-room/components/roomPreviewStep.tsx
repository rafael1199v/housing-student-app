import { useTranslation } from "react-i18next";
import type { CreateRoomFormOutput } from "../shared/createRoomSchema";
import {
	ROOM_POLICY_OPTIONS,
	ROOM_SERVICE_OPTIONS,
	ROOM_STATUS_OPTIONS,
} from "../shared/roomWizardConfig";
import type { RoomDraftPolicy } from "../store/roomDraftStore";

type RoomPreviewStepProps = {
	values: CreateRoomFormOutput;
	selectedServices: number[];
	policies: RoomDraftPolicy[];
	previews: string[];
	persistedImageNames: string[];
};

function PreviewField({ label, value }: { label: string; value?: string }) {
	return (
		<div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
			<p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
			<p className="mt-1 text-sm text-slate-800">{value}</p>
		</div>
	);
}

export function RoomPreviewStep({
	values,
	selectedServices,
	policies,
	previews,
	persistedImageNames,
}: RoomPreviewStepProps) {
	const { t } = useTranslation();

	const selectedServiceOptions = ROOM_SERVICE_OPTIONS.filter((option) =>
		selectedServices.includes(option.id),
	);
	const selectedStatus = ROOM_STATUS_OPTIONS.find(
		(option) => option.value === values.roomStatus,
	);

	return (
		<div className="space-y-5">
			<section className="surface-section space-y-4">
				<div>
					<h2 className="text-lg font-semibold text-slate-900">
						{t("newRoom.previewRoomLabel")}
					</h2>
					<p className="text-sm text-slate-500">
						{t("newRoom.previewDescription")}
					</p>
				</div>

				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					<PreviewField
						label={t("newRoom.nameLabel")}
						value={values.name || t("newRoom.previewEmpty")}
					/>
					<PreviewField
						label={t("newRoom.statusLabel")}
						value={
							selectedStatus
								? t(selectedStatus.labelKey)
								: t("newRoom.previewEmpty")
						}
					/>
					<PreviewField
						label={t("newRoom.priceLabel")}
						value={
							values.price
								? `Bs. ${values.price.toFixed(2)}`
								: t("newRoom.previewEmpty")
						}
					/>
					<PreviewField
						label={t("newRoom.previewLocationTitle")}
						value={
							Number.isFinite(values.latitude) &&
							Number.isFinite(values.longitude)
								? `${values.latitude.toFixed(6)}, ${values.longitude.toFixed(6)}`
								: t("newRoom.previewCoordinatesMissing")
						}
					/>
				</div>

				<div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
					<p className="text-xs uppercase tracking-wide text-slate-500">
						{t("newRoom.descriptionLabel")}
					</p>
					<p className="mt-1 text-sm text-slate-800 wrap-break-word">
						{values.description || t("newRoom.previewEmpty")}
					</p>
				</div>
			</section>

			<section className="surface-section space-y-3">
				<h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
					{t("newRoom.previewServicesTitle")}
				</h3>
				{selectedServiceOptions.length === 0 ? (
					<p className="text-sm text-slate-500">{t("newRoom.servicesEmpty")}</p>
				) : (
					<div className="flex flex-wrap gap-2">
						{selectedServiceOptions.map((service) => (
							<div
								key={service.id}
								className="flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5"
							>
								{service.icon && (
									<img
										src={service.icon}
										alt=""
										className="h-4 w-4 brightness-0 opacity-60"
										aria-hidden="true"
									/>
								)}
								<span className="text-sm text-slate-700">
									{t(service.labelKey)}
								</span>
							</div>
						))}
					</div>
				)}
			</section>

			<section className="surface-section space-y-3">
				<h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
					{t("newRoom.previewPoliciesTitle")}
				</h3>
				{policies.length === 0 ? (
					<p className="text-sm text-slate-500">{t("newRoom.previewEmpty")}</p>
				) : (
					<div className="space-y-2">
						{policies.map((policy, index) => {
							const policyOption = ROOM_POLICY_OPTIONS.find(
								(option) => option.id === policy.id,
							);
							return (
								<div
									key={`${policy.id}-${index}`}
									className="rounded-lg border border-slate-200 bg-white px-3 py-2"
								>
									<div className="flex items-center gap-2">
										{policyOption?.icon && (
											<img
												src={policyOption.icon}
												alt=""
												className="h-4 w-4 brightness-0 opacity-60"
												aria-hidden="true"
											/>
										)}
										<p className="text-sm font-medium text-slate-800">
											{policyOption
												? t(policyOption.labelKey)
												: t("newRoom.previewEmpty")}
										</p>
									</div>
									<p className="mt-0.5 text-sm text-slate-600">
										{policy.description || t("newRoom.previewEmpty")}
									</p>
								</div>
							);
						})}
					</div>
				)}
			</section>

			<section className="surface-section space-y-3">
				<h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
					{t("newRoom.previewImagesTitle")}
				</h3>
				{previews.length > 0 ? (
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
						{previews.map((src, index) => (
							<img
								key={src}
								src={src}
								alt={t("newRoom.imagePreviewAlt", { n: index + 1 })}
								className="aspect-video w-full rounded-xl object-cover"
							/>
						))}
					</div>
				) : persistedImageNames.length > 0 ? (
					<div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
						<p>{t("newRoom.imagesNeedReattach")}</p>
						<p className="mt-1 text-amber-900">
							{persistedImageNames.join(", ")}
						</p>
					</div>
				) : (
					<p className="text-sm text-slate-500">{t("newRoom.previewEmpty")}</p>
				)}
			</section>
		</div>
	);
}
