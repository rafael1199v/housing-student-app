import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import See from "../../../assets/see.png";
import Unsee from "../../../assets/unsee.png";
import i18n from "../../../i18n";
import authService from "../../../services/authService";
import { useAuthActions } from "../store/authStore";

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

	const { mutate, isPending } = useMutation({
		mutationFn: authService.login,
		onSuccess: (response) => {
			setAccessToken(response.accessToken);
			setRefreshToken(response.refreshToken);
			toast.success(t("auth.login.successToast"));
			navigate("/");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});

	const onSubmit: SubmitHandler<IFormInput> = (data) => {
		mutate({ email: data.email, password: data.password });
	};

	return (
		<div className="editorial-hero min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Card */}
				<div className="rounded-2xl bg-surface-container-lowest p-8 shadow-2xl">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-3xl font-semibold text-slate-900 mb-2">
							{t("auth.login.title")}
						</h1>
						<p className="text-slate-500 text-sm">{t("auth.login.subtitle")}</p>
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
								console.log(credentialResponse);
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
	);
}

export default Login;
