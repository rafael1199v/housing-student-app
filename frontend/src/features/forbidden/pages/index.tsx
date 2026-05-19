import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export function ForbiddenPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	return (
		<div className="space-y-8">
			<div className="flex flex-wrap justify-center origin-center h-dvh content-center">
				<section className="m-3 h-min space-y-4 rounded-2xl p-3 text-center md:m-0 md:p-6">
					<h1 className="md:text-[20rem] text-9xl">403</h1>
					<h1 className="text-7xl font-bold">Oops!</h1>
					<h1 className="text-3xl font-semibold text-slate-900">
						{t("forbidden.title")}
					</h1>
					<p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-900">
						{t("forbidden.message")}
					</p>
					<button
						type="button"
						onClick={() => navigate("/")}
						className="shrink-0 rounded-full bg-secondary-fixed px-4 py-2 text-sm font-medium text-on-secondary-fixed transition hover:brightness-95"
					>
						{t("forbidden.backButton")}
					</button>
				</section>
			</div>
		</div>
	);
}
