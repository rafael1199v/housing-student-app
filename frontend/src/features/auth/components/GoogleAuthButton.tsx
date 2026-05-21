import { type CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getGoogleLocale } from "../../../i18n";
import { GoogleAuthProvider } from "../../../shared/providers/GoogleAuthProvider";

const MIN_GOOGLE_BUTTON_WIDTH = 240;
const MAX_GOOGLE_BUTTON_WIDTH = 400;

type GoogleAuthButtonProps = {
	onSuccess: (credentialResponse: CredentialResponse) => void;
};

function clampGoogleButtonWidth(width: number): number {
	return Math.min(
		MAX_GOOGLE_BUTTON_WIDTH,
		Math.max(MIN_GOOGLE_BUTTON_WIDTH, Math.floor(width)),
	);
}

export function GoogleAuthButton({ onSuccess }: GoogleAuthButtonProps) {
	const { i18n } = useTranslation();
	const containerRef = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState<number | null>(null);
	const googleLocale = getGoogleLocale(i18n.resolvedLanguage ?? i18n.language);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const updateWidth = () => {
			setWidth(clampGoogleButtonWidth(container.getBoundingClientRect().width));
		};

		updateWidth();

		const resizeObserver = new ResizeObserver(updateWidth);
		resizeObserver.observe(container);

		return () => resizeObserver.disconnect();
	}, []);

	return (
		<div
			ref={containerRef}
			className="flex min-h-11 w-full items-center justify-center overflow-visible"
		>
			{width !== null && (
				<GoogleAuthProvider>
					<GoogleLogin
						key={`${googleLocale}-${width}`}
						onSuccess={onSuccess}
						size="large"
						shape="pill"
						width={width}
						containerProps={{
							className: "w-full",
							style: { width: "100%" },
						}}
					/>
				</GoogleAuthProvider>
			)}
		</div>
	);
}
