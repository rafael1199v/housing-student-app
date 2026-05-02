import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import i18n from "../../../i18n";
import authService from "../../../services/authService";
import { NationalityDropdown } from "../../auth/components/NationalityDropdown";
import { useAccessToken } from "../../auth/store/authStore";
import { getRoleFromAccessToken } from "../../auth/utils/tokenClaims";
import type { UpdateUserDataDto } from "../types/updateUserDataDto";
import formatToInputDate from "../utils/StringToDate";

const v = (key: string) => i18n.t(key, { ns: "validation" });

const GENDER_OPTIONS = [
	{ value: "Masculino", labelKey: "profileSettings.genderMale" },
	{ value: "Femenino", labelKey: "profileSettings.genderFemale" },
	{ value: "Otro", labelKey: "profileSettings.genderOther" },
] as const;

const updateProfileSchema = z.object({
	firstName: z
		.string()
		.trim()
		.min(1, v("firstName.required"))
		.max(50, v("firstName.tooLong")),
	lastName: z.string().trim().max(50, v("lastName.tooLong")),
	phoneNumber: z
		.string()
		.optional()
		.refine((val) => !val || val.length >= 7, v("phone.tooShort"))
		.refine((val) => !val || val.length <= 15, v("phone.tooLong"))
		.refine(
			(val) => !val || /^\+\d+$/.test(val),
			v("phone.onlyExtensionAndDigits"),
		),
	nationality: z.string(),
	gender: z.string(),
	birthdate: z.string(),
});

type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export function ProfileSettings() {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const accessToken = useAccessToken();

	const { data: userData, isLoading } = useQuery({
		queryKey: ["user-data"],
		queryFn: () => authService.getData(),
	});

	const role = getRoleFromAccessToken(accessToken);

	const {
		register,
		handleSubmit,
		reset,
		watch,
		setValue,
		formState: { errors },
	} = useForm<UpdateProfileFormValues>({
		resolver: zodResolver(updateProfileSchema),
	});

	useEffect(() => {
		if (userData) {
			reset({
				firstName: userData.firstName,
				lastName: userData.lastName,
				phoneNumber: userData.phoneNumber,
				nationality: userData.nationality,
				gender: userData.gender,
				birthdate: formatToInputDate(userData.birthdate),
			});
		}
	}, [userData, reset]);

	const mutation = useMutation({
		mutationFn: (dto: Partial<UpdateUserDataDto>) =>
			authService.updateData(dto),
		onSuccess: () => {
			toast.success(t("profileSettings.saveSuccess"));
			queryClient.invalidateQueries({ queryKey: ["user-data"] });
		},
		onError: (error: Error) => {
			toast.error(t("profileSettings.saveError", { message: error.message }));
		},
	});

	const onSubmit = (values: UpdateProfileFormValues) => {
		const dto: Partial<UpdateUserDataDto> = {};

		if (values.firstName !== userData?.firstName)
			dto.firstName = values.firstName;
		if (values.lastName !== userData?.lastName) dto.lastName = values.lastName;
		if (values.phoneNumber !== userData?.phoneNumber)
			dto.phoneNumber = values.phoneNumber;
		if (values.nationality !== userData?.nationality)
			dto.nationality = values.nationality;
		if (values.gender !== userData?.gender) dto.gender = values.gender;

		const originalBirth = userData
			? formatToInputDate(userData.birthdate)
			: null;
		if (values.birthdate !== originalBirth) dto.birthdate = values.birthdate;

		if (Object.keys(dto).length === 0) {
			toast.success(t("profileSettings.saveSuccess"));
			return;
		}

		mutation.mutate(dto);
	};

	if (isLoading) {
		return (
			<div className="flex justify-center py-16">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
			</div>
		);
	}

	return (
		<div className="mx-auto w-full max-w-2xl space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-semibold text-slate-900">
					{t("profileSettings.title")}
				</h1>
				<p className="mt-1 text-sm text-slate-500">
					{t("profileSettings.subtitle")}
				</p>
			</div>

			{/* Read-only account info */}
			<section className="surface-section space-y-4">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div className="space-y-1">
						<p className="text-sm font-medium text-slate-700">
							{t("profileSettings.emailLabel")}
						</p>
						<p className="text-sm text-slate-900">{userData?.email}</p>
					</div>
					<div className="space-y-1">
						<p className="text-sm font-medium text-slate-700">
							{t("profileSettings.roleLabel")}
						</p>
						<p className="text-sm text-slate-900">{t(`roles.${role}`)}</p>
					</div>
				</div>
			</section>

			{/* Editable form */}
			<form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
				<section className="surface-section space-y-5">
					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
						{/* First Name */}
						<div className="space-y-1.5">
							<label
								htmlFor="firstName"
								className="block text-sm font-medium text-slate-700"
							>
								{t("profileSettings.firstNameLabel")}
							</label>
							<input
								id="firstName"
								type="text"
								autoComplete="given-name"
								{...register("firstName")}
								className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
							/>
							{errors.firstName && (
								<p className="text-xs text-red-600">
									{errors.firstName.message}
								</p>
							)}
						</div>

						{/* Last Name */}
						<div className="space-y-1.5">
							<label
								htmlFor="lastName"
								className="block text-sm font-medium text-slate-700"
							>
								{t("profileSettings.lastNameLabel")}
							</label>
							<input
								id="lastName"
								type="text"
								autoComplete="family-name"
								{...register("lastName")}
								className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
							/>
							{errors.lastName && (
								<p className="text-xs text-red-600">
									{errors.lastName.message}
								</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
						{/* Phone Number */}
						<div className="space-y-1.5">
							<label
								htmlFor="phoneNumber"
								className="block text-sm font-medium text-slate-700"
							>
								{t("profileSettings.phoneNumberLabel")}
							</label>
							<input
								id="phoneNumber"
								type="tel"
								autoComplete="tel"
								{...register("phoneNumber")}
								className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
							/>
							{errors.phoneNumber && (
								<p className="text-xs text-red-600">
									{errors.phoneNumber.message}
								</p>
							)}
						</div>

						{/* Nationality */}
						<div className="space-y-1.5">
							<label
								htmlFor="nationality"
								className="block text-sm font-medium text-slate-700"
							>
								{t("profileSettings.nationalityLabel")}
							</label>
							<NationalityDropdown
								value={watch("nationality") || ""}
								onChange={(code) => setValue("nationality", code)}
								ariaLabel={t("profileSettings.nationalityLabel")}
							/>
							{errors.nationality && (
								<p className="text-xs text-red-600">
									{errors.nationality.message}
								</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
						{/* Gender */}
						<div className="space-y-1.5">
							<label
								htmlFor="gender"
								className="block text-sm font-medium text-slate-700"
							>
								{t("profileSettings.genderLabel")}
							</label>
							<select
								id="gender"
								{...register("gender")}
								className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
							>
								<option value="">—</option>
								{GENDER_OPTIONS.map((opt) => (
									<option key={opt.value} value={opt.value}>
										{t(opt.labelKey)}
									</option>
								))}
							</select>
							{errors.gender && (
								<p className="text-xs text-red-600">{errors.gender.message}</p>
							)}
						</div>

						{/* Birthdate */}
						<div className="space-y-1.5">
							<label
								htmlFor="birthdate"
								className="block text-sm font-medium text-slate-700"
							>
								{t("profileSettings.birthdateLabel")}
							</label>
							<input
								id="birthdate"
								type="date"
								{...register("birthdate")}
								className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
							/>
							{errors.birthdate && (
								<p className="text-xs text-red-600">
									{errors.birthdate.message}
								</p>
							)}
						</div>
					</div>
				</section>

				{/* Actions */}
				<div className="flex items-center justify-between pb-8">
					<button
						type="button"
						// onClick={() => navigate("/profile-settings/change-password")}
						className="text-sm text-primary underline underline-offset-2 transition hover:opacity-75"
					>
						{t("profileSettings.changePasswordButton")}
					</button>
					<button
						type="submit"
						disabled={mutation.isPending}
						className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-on-primary transition hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{mutation.isPending
							? t("profileSettings.savePending")
							: t("profileSettings.saveButton")}
					</button>
				</div>
			</form>
		</div>
	);
}
