import { useMutation } from "@tanstack/react-query";
import authService from "../../../services/authService";

export function useGoogleAuthentication() {
	const _registerWithGoogle = useMutation({
		mutationFn: async () => {
			console.log("Google registration");
		},
		onSuccess: () => {
			console.log("Google registration");
		},
		onError: (error: Error) => {
			console.error(error.message);
		},
	});

	const _loginWithGoogle = useMutation({
		mutationFn: authService.googleLogin,
		onSuccess: (response) => {
			console.log(response);
		},
		onError: (error: Error) => {
			console.error(error.message);
		},
	});
}
