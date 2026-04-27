import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const LANG_STORAGE_KEY = "app_language";

export const LANGUAGES = [
	{ code: "es", flag: "🇧🇴", label: "ES" },
	{ code: "en", flag: "🇺🇸", label: "EN" },
	{ code: "pt", flag: "🇧🇷", label: "PT" },
] as const;

const supportedLanguages = LANGUAGES.map((l) => l.code);
type SupportedLang = (typeof LANGUAGES)[number]["code"];

function getInitialLanguage(): SupportedLang {
	const stored = localStorage.getItem(LANG_STORAGE_KEY);
	if (stored && (supportedLanguages as readonly string[]).includes(stored)) {
		return stored as SupportedLang;
	}
	return "en";
}

export async function loadLanguage(lang: string): Promise<void> {
	if (i18n.hasResourceBundle(lang, "common")) return;

	const [common, errors, validation] = await Promise.all([
		import(`./locales/${lang}/common.json`),
		import(`./locales/${lang}/errors.json`),
		import(`./locales/${lang}/validation.json`),
	]);

	i18n.addResourceBundle(lang, "common", common.default);
	i18n.addResourceBundle(lang, "errors", errors.default);
	i18n.addResourceBundle(lang, "validation", validation.default);
}

const initialLang = getInitialLanguage();

await i18n.use(initReactI18next).init({
	lng: initialLang,
	fallbackLng: "en",
	defaultNS: "common",
	ns: ["common", "errors", "validation"],
	interpolation: {
		escapeValue: false,
	},
});

await loadLanguage(initialLang);

export default i18n;
