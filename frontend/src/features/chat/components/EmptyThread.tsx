import { useTranslation } from "react-i18next";

export function EmptyThread() {
	const { t } = useTranslation();

	return (
		<div className="flex h-full items-center justify-center p-6 text-center text-sm text-slate-400">
			{t("chat.selectConversation")}
		</div>
	);
}
