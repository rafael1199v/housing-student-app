import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import commonEs from "./locales/es/common.json";
import errorsEs from "./locales/es/errors.json";
import validationEs from "./locales/es/validation.json";

i18n.use(initReactI18next).init({
	lng: "es",
	fallbackLng: "es",
	defaultNS: "common",
	ns: ["common", "errors", "validation"],
	resources: {
		es: {
			common: commonEs,
			errors: errorsEs,
			validation: validationEs,
		},
	},
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
