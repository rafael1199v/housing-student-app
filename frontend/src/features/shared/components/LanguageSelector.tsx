import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LANG_STORAGE_KEY } from "../../../i18n";

const LANGUAGES = [
	{ code: "es", flag: "🇧🇴", label: "ES" },
	{ code: "en", flag: "🇺🇸", label: "EN" },
	{ code: "pt", flag: "🇧🇷", label: "PT" },
] as const;

export function LanguageSelector() {
	const { i18n } = useTranslation();
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const current =
		LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

	const handleChange = (code: string) => {
		i18n.changeLanguage(code);
		localStorage.setItem(LANG_STORAGE_KEY, code);
		setOpen(false);
	};

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div ref={ref} className="relative">
			<button
				type="button"
				onClick={() => setOpen((prev) => !prev)}
				aria-haspopup="listbox"
				aria-expanded={open}
				className="rounded-full bg-surface-container-high px-3 py-2 text-xs font-medium transition hover:brightness-95"
			>
				{current.flag} {current.label} ▾
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
							className={`px-4 py-2 text-left text-xs font-medium transition ${
								i18n.language === code
									? "bg-primary text-on-primary"
									: "text-slate-700 hover:bg-surface-container"
							}`}
						>
							{flag} {label}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
