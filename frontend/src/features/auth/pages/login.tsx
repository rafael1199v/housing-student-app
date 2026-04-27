import { zodResolver } from "@hookform/resolvers/zod";
import { type CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import See from "../../../assets/see.png";
import Unsee from "../../../assets/unsee.png";
import { RoleEnum, type RoleEnum as RoleType } from "../../../global/enum/role";
import i18n from "../../../i18n";
import authService from "../../../services/authService";
import { useGoogleAuthentication } from "../hooks/google-hooks";
import { useAuthActions } from "../store/authStore";
import type { GoogleAuthResponse } from "../types/googleAuthResponse";

const loginSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, i18n.t("email.required", { ns: "validation" }))
		.email(i18n.t("email.invalid", { ns: "validation" })),
	password: z
		.string()
		.min(1, i18n.t("password.required", { ns: "validation" }))
		.min(8, i18n.t("password.tooShort", { ns: "validation" })),
});

type IFormInput = z.infer<typeof loginSchema>;

function Login() {
	const { t } = useTranslation();
	const [showPassword, setShowPassword] = useState(false);
	const { register, handleSubmit, formState } = useForm<IFormInput>({
		resolver: zodResolver(loginSchema),
	});
	const { setAccessToken, setRefreshToken } = useAuthActions();
	const navigate = useNavigate();

	const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
	const [showRoleSelection, setShowRoleSelection] = useState(false);

	const pendingGoogleIdTokenRef = useRef<string | null>(null);

	const navigateToHome = (accessToken: string, refreshToken: string) => {
		setAccessToken(accessToken);
		setRefreshToken(refreshToken);
		toast.success(t("auth.login.successToast"));
		navigate("/");
	};

	const closeRoleSelectionModal = () => {
		setShowRoleSelection(false);
		setSelectedRole(null);
		pendingGoogleIdTokenRef.current = null;
	};

	const { mutate, isPending } = useMutation({
		mutationFn: authService.login,
		onSuccess: (response) => {
			navigateToHome(response.accessToken, response.refreshToken);
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});

	const { loginWithGoogle, registerWithGoogle } = useGoogleAuthentication();

	const handleGoogleRegistration = async () => {
		if (selectedRole === null || pendingGoogleIdTokenRef.current === null) {
			return;
		}

		try {
			const googleRegisterResponse = await registerWithGoogle.mutateAsync({
				idToken: pendingGoogleIdTokenRef.current,
				role: selectedRole,
			});

			closeRoleSelectionModal();
			navigateToHome(
				googleRegisterResponse.accessToken,
				googleRegisterResponse.refreshToken,
			);
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: t("auth.login.googleRegisterError");
			toast.error(errorMessage);
		}
	};

	const handleGoogleAuthentication = async (
		credentialResponse: CredentialResponse,
	) => {
		if (credentialResponse.credential === undefined) {
			return;
		}

		try {
			const googleAuthResponse: GoogleAuthResponse =
				await loginWithGoogle.mutateAsync({
					idToken: credentialResponse.credential,
				});

			if (!googleAuthResponse.isNewUser && googleAuthResponse.credentials) {
				navigateToHome(
					googleAuthResponse.credentials.accessToken,
					googleAuthResponse.credentials.refreshToken,
				);
				return;
			}

			if (googleAuthResponse.isNewUser) {
				pendingGoogleIdTokenRef.current = credentialResponse.credential;
				setSelectedRole(null);
				setShowRoleSelection(true);
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: t("auth.login.googleLoginError");
			toast.error(errorMessage);
		}
	};

	const onSubmit: SubmitHandler<IFormInput> = (data) => {
		mutate({ email: data.email, password: data.password });
	};

	return (
		<>
			<div className="editorial-hero min-h-screen flex items-center justify-center p-4">
				<div className="w-full max-w-md">
					{/* Card */}
					<div className="rounded-2xl bg-surface-container-lowest p-8 shadow-2xl">
						{/* Header */}
						<div className="mb-8">
							<h1 className="text-3xl font-semibold text-slate-900 mb-2">
								{t("auth.login.title")}
							</h1>
							<p className="text-slate-500 text-sm">
								{t("auth.login.subtitle")}
							</p>
						</div>

						{/* Form */}
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
							{/* Email Input */}
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">
									{t("auth.login.emailLabel")}
								</label>
								<input
									className="field-filled w-full px-4 py-2.5"
									type="email"
									placeholder={t("auth.login.emailPlaceholder")}
									{...register("email")}
								/>
								{formState.errors.email && (
									<p className="text-red-500 text-xs mt-1">
										{formState.errors.email.message}
									</p>
								)}
							</div>

							{/* Password Input */}
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">
									{t("auth.login.passwordLabel")}
								</label>
								<div className="relative">
									<input
										className="field-filled w-full px-4 py-2.5 pr-16"
										type={showPassword ? "text" : "password"}
										placeholder="••••••••"
										{...register("password")}
									/>
									<button
										type="button"
										onClick={() =>
											setShowPassword((currentValue) => !currentValue)
										}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600 hover:text-slate-800"
										aria-label={
											showPassword
												? t("auth.login.hidePassword")
												: t("auth.login.showPassword")
										}
									>
										{showPassword ? (
											<img src={Unsee} className="w-5" />
										) : (
											<img src={See} className="w-5" />
										)}
									</button>
								</div>
								{formState.errors.password && (
									<p className="text-red-500 text-xs mt-1">
										{formState.errors.password.message}
									</p>
								)}
							</div>

							{/* Submit Button */}
							<button
								className="btn-primary mt-6 w-full"
								type="submit"
								disabled={isPending}
							>
								{isPending
									? t("auth.login.submitPending")
									: t("auth.login.submit")}
							</button>

							<GoogleLogin
								onSuccess={(credentialResponse) => {
									handleGoogleAuthentication(credentialResponse);
								}}
								shape="pill"
							/>
						</form>

						{/* Divider */}
						<div className="my-6 flex items-center">
							<div className="flex-1 border-t border-outline-variant/15"></div>
							<span className="px-3 text-xs text-slate-500">
								{t("auth.login.noAccount")}
							</span>
							<div className="flex-1 border-t border-outline-variant/15"></div>
						</div>

						{/* Sign Up Link */}
						<a
							href="/register"
							className="block w-full rounded-full bg-secondary-fixed px-4 py-2.5 text-center font-medium text-on-secondary-fixed transition hover:brightness-95"
						>
							{t("auth.login.createAccount")}
						</a>
					</div>
				</div>
			</div>

			{showRoleSelection && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/70 p-4 backdrop-blur-sm">
					<div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-2xl">
						<h2 className="text-2xl font-semibold text-slate-900">
							{t("auth.login.roleModalTitle")}
						</h2>
						<p className="mt-2 text-sm text-slate-600">
							{t("auth.login.roleModalSubtitle")}
						</p>

						<div className="mt-6">
							<label className="mb-2 block text-sm font-medium text-slate-700">
								{t("auth.register.roleLabel")}
							</label>
							<select
								className="field-filled w-full px-4 py-2.5"
								value={selectedRole ?? ""}
								onChange={(event) => {
									const value = event.target.value;
									setSelectedRole(value === "" ? null : (value as RoleType));
								}}
								disabled={registerWithGoogle.isPending}
							>
								<option value="">{t("auth.register.rolePlaceholder")}</option>
								<option value={RoleEnum.Student}>
									{t("auth.register.roleStudent")}
								</option>
								<option value={RoleEnum.Householder}>
									{t("auth.register.roleOwner")}
								</option>
							</select>
						</div>

						<div className="mt-6 flex gap-3">
							<button
								type="button"
								onClick={closeRoleSelectionModal}
								className="w-1/2 rounded-full border border-outline-variant/30 px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100"
								disabled={registerWithGoogle.isPending}
							>
								{t("auth.login.roleModalCancel")}
							</button>
							<button
								type="button"
								onClick={handleGoogleRegistration}
								className="btn-primary w-1/2"
								disabled={selectedRole === null || registerWithGoogle.isPending}
							>
								{registerWithGoogle.isPending
									? t("auth.login.roleModalSubmitPending")
									: t("auth.login.roleModalSubmit")}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default Login;
