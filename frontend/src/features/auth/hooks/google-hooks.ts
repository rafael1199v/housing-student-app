import { useMutation } from "@tanstack/react-query";
import { authService } from "../../../services/authService";

export function useGoogleAuthentication() {
	const registerWithGoogle = useMutation({
		mutationFn: authService.googleRegister,
		onError: (error: Error) => {
			console.error(error.message);
		},
	});

	const loginWithGoogle = useMutation({
		mutationFn: authService.googleLogin,
		onError: (error: Error) => {
			console.error(error.message);
		},
	});

	return {
		loginWithGoogle,
		registerWithGoogle,
	};
}
