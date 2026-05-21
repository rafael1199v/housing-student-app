import { describe, expect, it } from "vitest";
import { getGoogleLocale } from "./i18n";

describe("getGoogleLocale", () => {
	it("maps supported application languages to Google locales", () => {
		expect(getGoogleLocale("es")).toBe("es");
		expect(getGoogleLocale("en")).toBe("en");
		expect(getGoogleLocale("pt")).toBe("pt-BR");
	});

	it("normalizes regional language values", () => {
		expect(getGoogleLocale("es-BO")).toBe("es");
		expect(getGoogleLocale("pt-BR")).toBe("pt-BR");
	});

	it("falls back to English for unsupported language values", () => {
		expect(getGoogleLocale("fr")).toBe("en");
		expect(getGoogleLocale("")).toBe("en");
	});
});
