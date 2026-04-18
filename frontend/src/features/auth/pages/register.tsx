import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import viteLogo from "/vite.svg";
import reactLogo from "../../../assets/react.svg";
import See from "../../../assets/see.png";
import Unsee from "../../../assets/unsee.png";
import i18n from "../../../i18n";
import authService from "../../../services/authService";
import { LATIN_AMERICAN_COUNTRIES } from "../components/NationalitySelector";
import type { RegisterDto } from "../types/registerDto";

const v = (key: string) => i18n.t(key, { ns: "validation" });

const registerSchema = z
	.object({
		email: z
			.string()
			.trim()
			.min(1, v("email.required"))
			.email(v("email.invalid"))
			.max(150, v("email.tooLong")),
		password: z
			.string()
			.min(1, v("password.required"))
			.min(8, v("password.tooShort"))
			.regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
				message: v("password.complexity"),
			})
			.max(150, v("password.tooLong")),
		confirmPassword: z.string().min(1, v("confirmPassword.required")),
		role: z.string().min(1, v("role.required")),
		firstName: z
			.string()
			.trim()
			.min(1, v("firstName.required"))
			.max(150, v("firstName.tooLong")),
		lastName: z
			.string()
			.trim()
			.min(1, v("lastName.required"))
			.max(150, v("lastName.tooLong")),
		phoneNumber: z
			.string()
			.trim()
			.min(1, v("phone.required"))
			.regex(/^\d+$/, v("phone.onlyDigits"))
			.min(7, v("phone.tooShort"))
			.max(15, v("phone.tooLong")),
		phoneExtension: z.string().min(1, v("phoneExtension.required")),
		nationality: z.string().min(1, v("nationality.required")),
		gender: z.string().min(1, v("gender.required")),
		imageUrl: z.union([
			z.literal(""),
			z.string().url(v("profilePhoto.invalidUrl")),
		]),
		birthDate: z.string().min(1, v("birthDate.required")),
	})
	.superRefine((data, context) => {
		if (data.password !== data.confirmPassword) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: v("confirmPassword.mismatch"),
				path: ["confirmPassword"],
			});
		}

		const birthDate = new Date(data.birthDate);
		if (Number.isNaN(birthDate.getTime())) {
			return;
		}
	});

type RegisterFormInput = z.input<typeof registerSchema>;
type RegisterFormOutput = z.output<typeof registerSchema>;

function Register() {
	const { t } = useTranslation();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const { register, handleSubmit, formState } = useForm<
		RegisterFormInput,
		unknown,
		RegisterFormOutput
	>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			phoneExtension: "",
			nationality: "",
			role: "",
			imageUrl: "",
		},
	});
	const nav = useNavigate();

	const { mutate, isPending } = useMutation({
		mutationFn: authService.register,
		onSuccess: () => {
			toast.success(t("auth.register.successToast"));
			nav("/login");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});

	const onSubmit: SubmitHandler<RegisterFormOutput> = (data) => {
		const newRegister: RegisterDto = {
			email: data.email,
			password: data.password,
			role: data.role,
			firstName: data.firstName,
			lastName: data.lastName,
			phoneNumber: `${data.phoneExtension}${data.phoneNumber}`,
			nationality: data.nationality,
			gender: data.gender,
			imageUrl: data.imageUrl,
			birthdate: data.birthDate,
		};

		mutate(newRegister);
	};

	return (
		<div className="editorial-hero min-h-screen px-4 py-12 sm:px-6 lg:px-8">
			<div className="max-w-2xl mx-auto">
				{/* Card */}
				<div className="rounded-2xl bg-surface-container-lowest p-8 sm:p-10 shadow-2xl">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-3xl font-semibold text-slate-900 mb-2">
							{t("auth.register.title")}
						</h1>
						<p className="text-slate-500 text-sm">
							{t("auth.register.subtitle")}
						</p>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* Name Section */}
						<div className="grid sm:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">
									{t("auth.register.firstNameLabel")}
								</label>
								<input
									className="field-filled w-full px-4 py-2.5"
									placeholder={t("auth.register.firstNamePlaceholder")}
									{...register("firstName")}
								/>
								{formState.errors.firstName && (
									<p className="text-red-500 text-xs mt-1">
										{formState.errors.firstName.message}
									</p>
								)}
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">
									{t("auth.register.lastNameLabel")}
								</label>
								<input
									className="field-filled w-full px-4 py-2.5"
									placeholder={t("auth.register.lastNamePlaceholder")}
									{...register("lastName")}
								/>
								{formState.errors.lastName && (
									<p className="text-red-500 text-xs mt-1">
										{formState.errors.lastName.message}
									</p>
								)}
							</div>
						</div>

						{/* Personal Info Section */}
						<div className="grid sm:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">
									{t("auth.register.genderLabel")}
								</label>
								<select
									className="field-filled w-full px-4 py-2.5"
									{...register("gender")}
								>
									<option value="">{t("auth.register.genderSelect")}</option>
									<option value="Masculino">
										{t("auth.register.genderMale")}
									</option>
									<option value="Femenino">
										{t("auth.register.genderFemale")}
									</option>
									<option value="Otro">{t("auth.register.genderOther")}</option>
								</select>
								{formState.errors.gender && (
									<p className="text-red-500 text-xs mt-1">
										{formState.errors.gender.message}
									</p>
								)}
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">
									{t("auth.register.birthDateLabel")}
								</label>
								<input
									type="date"
									className="field-filled w-full px-4 py-2.5"
									{...register("birthDate")}
								/>
								{formState.errors.birthDate && (
									<p className="text-red-500 text-xs mt-1">
										{formState.errors.birthDate.message}
									</p>
								)}
							</div>
						</div>

						{/* Location & Phone Section */}
						<div className="grid sm:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">
									{t("auth.register.nationalityLabel")}
								</label>
								<select
									{...register("nationality")}
									className="field-filled w-full px-4 py-2.5"
								>
									<option value="">
										{t("auth.register.nationalitySelect")}
									</option>
									{LATIN_AMERICAN_COUNTRIES.map((country) => (
										<option key={country.code} value={country.code}>
											{country.flag} {country.name}
										</option>
									))}
								</select>
								{formState.errors.nationality && (
									<p className="text-red-500 text-xs mt-1">
										{formState.errors.nationality.message}
									</p>
								)}
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">
									{t("auth.register.phoneLabel")}
								</label>
								<div>
									<div className="flex gap-2">
										<select
											{...register("phoneExtension")}
											className="field-filled px-3 py-2.5 shrink-0"
										>
											<option value="">
												{t("auth.register.phoneExtPlaceholder")}
											</option>
											{LATIN_AMERICAN_COUNTRIES.map((country) => (
												<option key={country.code} value={country.extension}>
													{country.flag} {country.extension}
												</option>
											))}
										</select>
										<input
											className="field-filled w-3 flex-1 px-4 py-2.5"
											type="tel"
											placeholder="1234567"
											{...register("phoneNumber")}
										/>
									</div>
									{formState.errors.phoneExtension && (
										<p className="text-red-500 text-xs mt-1">
											{formState.errors.phoneExtension.message}
										</p>
									)}
									{formState.errors.phoneNumber && (
										<p className="text-red-500 text-xs mt-1">
											{formState.errors.phoneNumber.message}
										</p>
									)}
								</div>
							</div>
						</div>

						{/* Profile Image */}
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">
								{t("auth.register.photoLabel")}
							</label>
							<input
								className="field-filled w-full px-4 py-2.5"
								type="url"
								placeholder={t("auth.register.photoPlaceholder")}
								{...register("imageUrl")}
							/>
							{formState.errors.imageUrl && (
								<p className="text-red-500 text-xs mt-1">
									{formState.errors.imageUrl.message}
								</p>
							)}
						</div>

						{/* Divider */}
						<div className="relative py-2">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-outline-variant/15"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-surface-container-lowest text-slate-500">
									{t("auth.register.credentialsDivider")}
								</span>
							</div>
						</div>

						{/* Email & Role */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div className="sm:col-span-2">
								<label className="block text-sm font-medium text-slate-700 mb-2">
									{t("auth.register.emailLabel")}
								</label>
								<input
									className="field-filled w-full px-4 py-2.5"
									type="email"
									placeholder={t("auth.register.emailPlaceholder")}
									{...register("email")}
								/>
								{formState.errors.email && (
									<p className="text-red-500 text-xs mt-1">
										{formState.errors.email.message}
									</p>
								)}
							</div>
							<div className="sm:col-span-1">
								<label className="block text-sm font-medium text-slate-700 mb-2">
									{t("auth.register.roleLabel")}
								</label>
								<select
									{...register("role")}
									className="field-filled w-full px-3 py-2.5 shrink-0"
								>
									<option value="">{t("auth.register.rolePlaceholder")}</option>
									<option value="student">
										{t("auth.register.roleStudent")}
									</option>
									<option value="householder">
										{t("auth.register.roleOwner")}
									</option>
								</select>
								{formState.errors.role && (
									<p className="text-red-500 text-xs mt-1">
										{formState.errors.role.message}
									</p>
								)}
							</div>
						</div>

						{/* Passwords */}
						<div className="grid sm:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">
									{t("auth.register.passwordLabel")}
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
												? t("auth.register.hidePassword")
												: t("auth.register.showPassword")
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
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">
									{t("auth.register.confirmPasswordLabel")}
								</label>
								<div className="relative">
									<input
										className="field-filled w-full px-4 py-2.5 pr-16"
										type={showConfirmPassword ? "text" : "password"}
										placeholder="••••••••"
										{...register("confirmPassword")}
									/>
									<button
										type="button"
										onClick={() =>
											setShowConfirmPassword((currentValue) => !currentValue)
										}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600 hover:text-slate-800"
										aria-label={
											showConfirmPassword
												? t("auth.register.hidePassword")
												: t("auth.register.showPassword")
										}
									>
										{showConfirmPassword ? (
											<img src={Unsee} className="w-5" />
										) : (
											<img src={See} className="w-5" />
										)}
									</button>
								</div>
								{formState.errors.confirmPassword && (
									<p className="text-red-500 text-xs mt-1">
										{formState.errors.confirmPassword.message}
									</p>
								)}
							</div>
						</div>

						{/* Submit Button */}
						<button
							className="btn-primary mt-6 w-full"
							type="submit"
							disabled={formState.isSubmitting || isPending}
						>
							{isPending
								? t("auth.register.submitPending")
								: t("auth.register.submit")}
						</button>
					</form>

					{/* Sign In Link */}
					<div className="mt-6 text-center">
						<p className="text-slate-600 text-sm">
							{t("auth.register.alreadyHaveAccount")}{" "}
							<a
								href="/login"
								className="text-primary hover:text-primary-container font-medium transition"
							>
								{t("auth.register.loginLink")}
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Register;
