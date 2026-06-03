import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LANG_STORAGE_KEY, LANGUAGES, loadLanguage } from "../../i18n";

interface LanguageSelectorProps {
	variant?: "dropdown" | "accordion";
}

export function LanguageSelector({
	variant = "dropdown",
}: LanguageSelectorProps) {
	const { t, i18n } = useTranslation();
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const current =
		LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

	const handleChange = async (code: string) => {
		await loadLanguage(code);
		i18n.changeLanguage(code);
		localStorage.setItem(LANG_STORAGE_KEY, code);
		setOpen(false);
	};

	useEffect(() => {
		if (variant !== "dropdown") return;

		const handleClickOutside = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [variant]);

	if (variant === "accordion") {
		return (
			<div className="w-full">
				<button
					type="button"
					onClick={() => setOpen((prev) => !prev)}
					aria-haspopup="listbox"
					aria-expanded={open}
					className="flex w-full items-center justify-between rounded-2xl bg-surface-container-high px-5 py-4 text-base font-medium text-slate-700 transition hover:bg-surface-container"
				>
					<span className="flex items-center gap-3">
						<img src={current.flag} alt={current.code} className="h-5 w-5" />
						{t("nav.language")}: {current.label}
					</span>
					<span className={`transition-transform ${open ? "rotate-180" : ""}`}>
						▾
					</span>
				</button>

				{open && (
					<div
						role="listbox"
						aria-label="Language options"
						className="mt-2 flex flex-col gap-2"
					>
						{LANGUAGES.map(({ code, flag, label }) => (
							<button
								key={code}
								type="button"
								role="option"
								aria-selected={i18n.language === code}
								onClick={() => handleChange(code)}
								className={`flex w-full items-center gap-3 rounded-2xl px-5 py-3 text-left text-base font-medium transition ${
									i18n.language === code
										? "bg-primary text-on-primary"
										: "text-slate-700 hover:bg-surface-container"
								}`}
							>
								<img src={flag} alt={code} className="h-5 w-5" />
								{label}
							</button>
						))}
					</div>
				)}
			</div>
		);
	}

	return (
		<div ref={ref} className="relative">
			<button
				type="button"
				onClick={() => setOpen((prev) => !prev)}
				aria-haspopup="listbox"
				aria-expanded={open}
				className="rounded-full bg-surface-container-high px-3 py-2 text-sm font-medium transition hover:brightness-95 flex items-center gap-2"
			>
				<img src={current.flag} alt={current.code} className="w-4 h-4" />
				{current.label} ▾
			</button>

			{open && (
				<div
					role="listbox"
					aria-label="Language options"
					className="absolute right-0 top-full mt-1 flex flex-col overflow-hidden rounded-xl bg-surface-container-high shadow-md"
				>
					{LANGUAGES.map(({ code, flag, label }) => (
						<button
							key={code}
							type="button"
							role="option"
							aria-selected={i18n.language === code}
							onClick={() => handleChange(code)}
							className={`px-4 py-2 text-left text-xs font-medium transition flex items-center gap-2 ${
								i18n.language === code
									? "bg-primary text-on-primary"
									: "text-slate-700 hover:bg-surface-container"
							}`}
						>
							<img src={flag} alt={code} className="w-4 h-4" />
							{label}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
