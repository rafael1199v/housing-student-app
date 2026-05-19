import { useTranslation } from "react-i18next";
import { WIZARD_STEPS, type WizardStep } from "../shared/roomWizardConfig";

type WizardProgressProps = {
	currentStep: number;
};

function StepStatusBadge({
	step,
	currentStep,
}: {
	step: WizardStep;
	currentStep: number;
}) {
	const { t } = useTranslation();
	const isCompleted = step.id < currentStep;
	const isCurrent = step.id === currentStep;

	return (
		<div className="flex items-start gap-3">
			<div
				className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
					isCurrent
						? "border-primary bg-primary text-on-primary"
						: isCompleted
							? "border-primary bg-primary/15 text-primary"
							: "border-slate-300 bg-white text-slate-500"
				}`}
			>
				{isCompleted ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="h-4 w-4"
						aria-hidden="true"
					>
						<path d="m5 12 5 5L20 7" />
					</svg>
				) : (
					step.number
				)}
			</div>
			<div>
				<p
					className={`text-sm font-semibold ${
						isCurrent ? "text-slate-900" : "text-slate-700"
					}`}
				>
					{t(step.titleKey)}
				</p>
				<p className="text-xs text-slate-500">{t(step.descriptionKey)}</p>
			</div>
		</div>
	);
}

export function WizardProgress({ currentStep }: WizardProgressProps) {
	const { t } = useTranslation();
	const currentStepTitle = t(WIZARD_STEPS[currentStep]?.titleKey);

	return (
		<>
			<div className="rounded-xl border border-slate-200 bg-white px-4 py-3 md:hidden">
				<div className="mb-2 flex items-center justify-between text-xs text-slate-600">
					<span>{t("newRoom.progressLabel")}</span>
					<span>
						{t("newRoom.mobileStepCounter", {
							step: currentStep + 1,
							total: WIZARD_STEPS.length,
						})}
					</span>
				</div>
				<p className="mb-3 text-sm font-medium text-slate-900">
					{currentStepTitle}
				</p>
				<div className="h-2 overflow-hidden rounded-full bg-slate-200">
					<div
						className="h-full rounded-full bg-primary transition-all"
						style={{
							width: `${((currentStep + 1) / WIZARD_STEPS.length) * 100}%`,
						}}
					/>
				</div>
			</div>

			<aside className="hidden md:block md:w-72 md:shrink-0">
				<div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-4">
					<p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
						{t("newRoom.progressLabel")}
					</p>
					<div className="space-y-4">
						{WIZARD_STEPS.map((step) => (
							<StepStatusBadge
								key={step.id}
								step={step}
								currentStep={currentStep}
							/>
						))}
					</div>
				</div>
			</aside>
		</>
	);
}
