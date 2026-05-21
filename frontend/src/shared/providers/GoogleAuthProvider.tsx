import { GoogleOAuthProvider } from "@react-oauth/google";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { GOOGLE_CLIENT_ID } from "../../config/constants";
import { getGoogleLocale } from "../../i18n";

type GoogleAuthProviderProps = {
	children: ReactNode;
};

export function GoogleAuthProvider({ children }: GoogleAuthProviderProps) {
	const { i18n } = useTranslation();
	const googleLocale = getGoogleLocale(i18n.resolvedLanguage ?? i18n.language);

	return (
		<GoogleOAuthProvider
			key={googleLocale}
			clientId={GOOGLE_CLIENT_ID}
			locale={googleLocale}
		>
			{children}
		</GoogleOAuthProvider>
	);
}
