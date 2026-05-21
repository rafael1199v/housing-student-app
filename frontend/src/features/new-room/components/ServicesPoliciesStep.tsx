import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	getNextAvailableServiceId,
	ROOM_POLICY_OPTIONS,
	ROOM_SERVICE_OPTIONS,
} from "../shared/roomWizardConfig";
import type { RoomDraftPolicy } from "../store/roomDraftStore";

type ServicesPoliciesStepProps = {
	selectedServices: number[];
	onChangeSelectedServices: (services: number[]) => void;
	policies: RoomDraftPolicy[];
	onChangePolicies: (policies: RoomDraftPolicy[]) => void;
	policyValidationError: string | null;
};

export function ServicesPoliciesStep({
	selectedServices,
	onChangeSelectedServices,
	policies,
	onChangePolicies,
	policyValidationError,
}: ServicesPoliciesStepProps) {
	const { t } = useTranslation();
	const availableServices = useMemo(
		() =>
			ROOM_SERVICE_OPTIONS.filter(
				(option) => !selectedServices.includes(option.id),
			),
		[selectedServices],
	);
	const [selectedServiceId, setSelectedServiceId] = useState<number | "">(
		getNextAvailableServiceId(selectedServices),
	);

	const selectedServiceOptions = useMemo(
		() =>
			ROOM_SERVICE_OPTIONS.filter((option) =>
				selectedServices.includes(option.id),
			),
		[selectedServices],
	);

	const availablePolicyOptions = useMemo(
		() =>
			ROOM_POLICY_OPTIONS.filter(
				(option) => !policies.some((policy) => policy.id === option.id),
			),
		[policies],
	);

	const addService = () => {
		if (!selectedServiceId || selectedServices.includes(selectedServiceId)) {
			return;
		}

		const nextServices = [...selectedServices, selectedServiceId];
		onChangeSelectedServices(nextServices);
		setSelectedServiceId(getNextAvailableServiceId(nextServices));
	};

	const removeService = (serviceId: number) => {
		const nextServices = selectedServices.filter((id) => id !== serviceId);
		onChangeSelectedServices(nextServices);
		if (!selectedServiceId) {
			setSelectedServiceId(getNextAvailableServiceId(nextServices));
		}
	};

	const addPolicy = () => {
		if (availablePolicyOptions.length === 0) return;

		onChangePolicies([
			...policies,
			{ id: availablePolicyOptions[0].id, description: "" },
		]);
	};

	const changePolicyId = (index: number, nextPolicyId: number) => {
		const alreadyUsed = policies.some(
			(policy, policyIndex) =>
				policyIndex !== index && policy.id === nextPolicyId,
		);
		if (alreadyUsed) return;

		const nextPolicies = [...policies];
		nextPolicies[index] = { ...nextPolicies[index], id: nextPolicyId };
		onChangePolicies(nextPolicies);
	};

	const changePolicyDescription = (index: number, description: string) => {
		const nextPolicies = [...policies];
		nextPolicies[index] = { ...nextPolicies[index], description };
		onChangePolicies(nextPolicies);
	};

	const removePolicy = (index: number) => {
		onChangePolicies(
			policies.filter((_, policyIndex) => policyIndex !== index),
		);
	};

	return (
		<div className="space-y-5">
			<section className="surface-section space-y-4">
				<div>
					<h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
						{t("newRoom.servicesSection")}
					</h2>
					<p className="mt-1 text-xs text-slate-500">
						{t("newRoom.servicesHint")}
					</p>
				</div>

				<div className="flex flex-col gap-2 sm:flex-row">
					<select
						value={selectedServiceId}
						onChange={(e) =>
							setSelectedServiceId(e.target.value ? Number(e.target.value) : "")
						}
						className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
						aria-label={t("newRoom.serviceSelectLabel")}
						disabled={availableServices.length === 0}
					>
						{availableServices.length === 0 && (
							<option value="">{t("newRoom.servicesAllAdded")}</option>
						)}
						{availableServices.map((service) => (
							<option key={service.id} value={service.id}>
								{t(service.labelKey)}
							</option>
						))}
					</select>
					<button
						type="button"
						onClick={addService}
						disabled={availableServices.length === 0}
						className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-on-primary transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
					>
						{t("newRoom.addServiceButton")}
					</button>
				</div>

				<div className="flex flex-wrap gap-2">
					{selectedServiceOptions.length === 0 ? (
						<p className="text-sm text-slate-500">
							{t("newRoom.servicesEmpty")}
						</p>
					) : (
						selectedServiceOptions.map((service) => (
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
								<button
									type="button"
									onClick={() => removeService(service.id)}
									aria-label={t("newRoom.removeServiceAriaLabel", {
										service: t(service.labelKey),
									})}
									className="rounded-full p-1 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="12"
										height="12"
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
						))
					)}
				</div>
			</section>

			<section className="surface-section space-y-4">
				<div>
					<h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
						{t("newRoom.policiesSection")}
					</h2>
					<p className="mt-1 text-xs text-slate-500">
						{t("newRoom.policiesHint")}
					</p>
				</div>

				<div className="space-y-3">
					{policies.map((policy, index) => {
						const selectedPolicyOption = ROOM_POLICY_OPTIONS.find(
							(option) => option.id === policy.id,
						);

						return (
							<div
								key={`${policy.id}-${index}`}
								className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3"
							>
								<div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
									<label className="space-y-1.5 text-sm font-medium text-slate-700">
										<div className="flex items-center gap-2">
											<span>{t("newRoom.policyTypeLabel")}</span>
											{selectedPolicyOption?.icon && (
												<img
													src={selectedPolicyOption.icon}
													alt=""
													className="h-4 w-4 brightness-0"
													aria-hidden="true"
												/>
											)}
										</div>
										<select
											value={policy.id}
											onChange={(e) =>
												changePolicyId(index, Number(e.target.value))
											}
											className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
										>
											{ROOM_POLICY_OPTIONS.filter((option) => {
												const isCurrent = option.id === policy.id;
												const isUsed = policies.some(
													(existing, existingIndex) =>
														existingIndex !== index &&
														existing.id === option.id,
												);
												return isCurrent || !isUsed;
											}).map((option) => (
												<option key={option.id} value={option.id}>
													{t(option.labelKey)}
												</option>
											))}
										</select>
									</label>

									<button
										type="button"
										onClick={() => removePolicy(index)}
										className="self-end rounded-full bg-surface-container-high px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-surface-container"
										aria-label={t("newRoom.removePolicyAriaLabel", {
											policy: selectedPolicyOption
												? t(selectedPolicyOption.labelKey)
												: "",
										})}
									>
										{t("newRoom.removePolicyButton")}
									</button>
								</div>

								<label className="space-y-1.5 text-sm font-medium text-slate-700">
									<span>{t("newRoom.policyDescriptionLabel")}</span>
									<textarea
										value={policy.description}
										onChange={(e) =>
											changePolicyDescription(index, e.target.value)
										}
										rows={3}
										placeholder={t("newRoom.policyDescriptionPlaceholder")}
										className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40"
									/>
								</label>
							</div>
						);
					})}
				</div>

				<div className="flex items-center justify-between gap-3">
					{policyValidationError ? (
						<p className="text-xs text-red-600">{policyValidationError}</p>
					) : (
						<span />
					)}
					<button
						type="button"
						onClick={addPolicy}
						disabled={availablePolicyOptions.length === 0}
						className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-on-primary transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
					>
						{t("newRoom.addPolicyButton")}
					</button>
				</div>
			</section>
		</div>
	);
}
