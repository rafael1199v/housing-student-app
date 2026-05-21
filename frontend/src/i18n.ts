import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import brFlag from "./assets/icons/flags/br.svg";
import esFlag from "./assets/icons/flags/es.svg";
import usFlag from "./assets/icons/flags/us.svg";

export const LANG_STORAGE_KEY = "app_language";

export const LANGUAGES = [
	{ code: "es", flag: esFlag, label: "ES" },
	{ code: "en", flag: usFlag, label: "EN" },
	{ code: "pt", flag: brFlag, label: "PT" },
] as const;

export type SupportedLang = (typeof LANGUAGES)[number]["code"];

export const GOOGLE_LOCALE_BY_LANG: Record<SupportedLang, string> = {
	es: "es",
	en: "en",
	pt: "pt-BR",
};

const supportedLanguages = LANGUAGES.map((l) => l.code);

export function getGoogleLocale(lang: string): string {
	const normalized = lang.split("-")[0] as SupportedLang;
	return GOOGLE_LOCALE_BY_LANG[normalized] ?? GOOGLE_LOCALE_BY_LANG.en;
}

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
