import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import commonEn from "./locales/en/common.json";
import errorsEn from "./locales/en/errors.json";
import validationEn from "./locales/en/validation.json";
import commonEs from "./locales/es/common.json";
import errorsEs from "./locales/es/errors.json";
import validationEs from "./locales/es/validation.json";
import commonPt from "./locales/pt/common.json";
import errorsPt from "./locales/pt/errors.json";
import validationPt from "./locales/pt/validation.json";

export const LANG_STORAGE_KEY = "app_language";

const supportedLanguages = ["es", "en", "pt"] as const;
type SupportedLang = (typeof supportedLanguages)[number];

function getInitialLanguage(): SupportedLang {
	const stored = localStorage.getItem(LANG_STORAGE_KEY);
	if (stored && (supportedLanguages as readonly string[]).includes(stored)) {
		return stored as SupportedLang;
	}
	return "en";
}

i18n.use(initReactI18next).init({
	lng: getInitialLanguage(),
	fallbackLng: "en",
	defaultNS: "common",
	ns: ["common", "errors", "validation"],
	resources: {
		es: {
			common: commonEs,
			errors: errorsEs,
			validation: validationEs,
		},
		en: {
			common: commonEn,
			errors: errorsEn,
			validation: validationEn,
		},
		pt: {
			common: commonPt,
			errors: errorsPt,
			validation: validationPt,
		},
	},
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
