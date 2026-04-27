import type { LoaderFunctionArgs } from "react-router";
import authService from "../../../services/authService";

export async function confirmEmailLoader({ request }: LoaderFunctionArgs) {
	const url = new URL(request.url);
	const userId = url.searchParams.get("userId")?.trim() ?? "";
	const token = url.searchParams.get("token")?.trim() ?? "";

	if (!userId || !token) {
		return { status: "error", messageKey: "auth.confirmEmail.missingParams" };
	}

	try {
		await authService.confirmEmail({ userId, token });
		return { status: "success", messageKey: "auth.confirmEmail.success" };
	} catch (error) {
		return {
			status: "error",
			messageKey: "auth.confirmEmail.genericError",
			message: error instanceof Error ? error.message : null,
		};
	}
}
