import { useTranslation } from "react-i18next";
import { useLoaderData, useNavigate } from "react-router";
import type { confirmEmailLoader } from "../loaders/ConfirmEmail.loader";

const statusStyles: Record<string, string> = {
	success:
		"mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700",
	error: "mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700",
};

function ConfirmEmail() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { status, messageKey, message } =
		useLoaderData<typeof confirmEmailLoader>();

	const statusMessage = message ?? t(messageKey);
	const statusClassName = statusStyles[status] ?? statusStyles.error;

	return (
		<div className="editorial-hero min-h-screen flex items-center justify-center px-4 py-12 sm:px-6">
			<div className="w-full max-w-xl rounded-2xl bg-surface-container-lowest p-8 text-center shadow-2xl sm:p-10">
				<h1 className="text-3xl font-semibold text-slate-900">
					{t("auth.confirmEmail.title")}
				</h1>

				<p className="mt-3 text-sm text-slate-600">
					{t("auth.confirmEmail.subtitle")}
				</p>

				<div className={statusClassName}>
					<p className="text-sm font-medium">{statusMessage}</p>
				</div>

				<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
					<button
						type="button"
						onClick={() => navigate("/login")}
						className="btn-primary"
					>
						{t("auth.confirmEmail.goToLogin")}
					</button>
				</div>
			</div>
		</div>
	);
}

export default ConfirmEmail;
