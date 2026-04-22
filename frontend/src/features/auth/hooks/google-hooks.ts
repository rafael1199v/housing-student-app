import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import authService from "../../../services/authService";
import { useAuthActions } from "../store/authStore";

export function useGoogleAuthentication() {
	const { t } = useTranslation();
	const { setAccessToken, setRefreshToken } = useAuthActions();
	const navigate = useNavigate();

	const registerWithGoogle = useMutation({
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

	const loginWithGoogle = useMutation({
		mutationFn: authService.googleLogin,
		onSuccess: (response) => {
			//Store the token and redirect to the login page
			if (!response.isNewUser) {
				setAccessToken(response.credentials!.accessToken);
				setRefreshToken(response.credentials!.refreshToken);
				toast.success(t("auth.login.successToast"));
				navigate("/");
			}

			//Trigger register action if the user is new
			registerWithGoogle.mutate();
		},
		onError: (error: Error) => {
			console.error(error.message);
		},
	});

	return {
		loginWithGoogle,
	};
}
