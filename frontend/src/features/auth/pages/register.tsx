import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import viteLogo from "/vite.svg";
import reactLogo from "../../../assets/react.svg";
import authService from "../../../services/authService";
import { LATIN_AMERICAN_COUNTRIES } from "../components/NationalitySelector";
import type { RegisterDto } from "../types/registerDto";

const registerSchema = z
	.object({
		email: z
			.string()
			.trim()
			.min(1, "El email es requerido")
			.email("Por favor ingresa un email válido"),
		password: z
			.string()
			.min(1, "La contraseña es requerida")
			.min(8, "La contraseña debe tener al menos 8 caracteres")
			.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
				message:
					"La contraseña debe contener letras, números y un carácter especial",
			}),
		confirmPassword: z.string().min(1, "Debe confirmar la contraseña"),
		role: z.string().min(1, "El rol es requerido"),
		firstName: z.string().trim().min(1, "El nombre es requerido"),
		lastName: z.string().trim().min(1, "El apellido es requerido"),
		phoneNumber: z
			.string()
			.trim()
			.min(1, "El teléfono es requerido")
			.regex(/^\d+$/, "El teléfono solo debe contener números")
			.min(7, "El teléfono debe tener al menos 7 dígitos"),
		phoneExtension: z.string().min(1, "La extensión es requerida"),
		nationality: z.string().min(1, "La nacionalidad es requerida"),
		age: z.coerce
			.number({ message: "La edad es requerida" })
			.int("La edad debe ser un número entero")
			.min(1, "La edad debe ser mayor que 0"),
		gender: z.string().min(1, "El género es requerido"),
		imageUrl: z.union([
			z.literal(""),
			z.string().url("La foto de perfil debe ser una URL válida"),
		]),
		birthDate: z.string().min(1, "La fecha de nacimiento es requerida"),
	})
	.superRefine((data, context) => {
		if (data.password !== data.confirmPassword) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Las contraseñas no coinciden",
				path: ["confirmPassword"],
			});
		}

		const birthDate = new Date(data.birthDate);
		if (Number.isNaN(birthDate.getTime())) {
			return;
		}

		const today = new Date();
		let calculatedAge = today.getFullYear() - birthDate.getFullYear();
		const hasNotHadBirthdayThisYear =
			today.getMonth() < birthDate.getMonth() ||
			(today.getMonth() === birthDate.getMonth() &&
				today.getDate() < birthDate.getDate());

		if (hasNotHadBirthdayThisYear) {
			calculatedAge -= 1;
		}

		if (calculatedAge !== data.age) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: "La edad no coincide con la fecha de nacimiento",
				path: ["age"],
			});
		}
	});

type RegisterFormInput = z.input<typeof registerSchema>;
type RegisterFormOutput = z.output<typeof registerSchema>;

function Register() {
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
			toast.success("Cuenta creada con éxito");
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
			age: data.age,
			gender: data.gender,
			imageUrl: data.imageUrl,
			birthdate: data.birthDate,
		};

		mutate(newRegister);
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-2xl mx-auto">
				{/* Logo Section */}
				<div className="flex justify-center gap-4 mb-8">
					<a
						href="https://vite.dev"
						target="_blank"
						className="transition-transform hover:scale-110"
					>
						<img
							src={viteLogo}
							className="w-12 h-12 opacity-80"
							alt="Vite logo"
						/>
					</a>
					<a
						href="https://react.dev"
						target="_blank"
						className="transition-transform hover:scale-110"
					>
						<img
							src={reactLogo}
							className="w-12 h-12 opacity-80"
							alt="React logo"
						/>
					</a>
				</div>

				{/* Card */}
				<div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 sm:p-10">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-3xl font-semibold text-slate-900 mb-2">
							Crea tu cuenta
						</h1>
						<p className="text-slate-500 text-sm">
							Únete a nuestra comunidad de estudiantes
						</p>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* Name Section */}
						<div className="grid sm:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">
									Nombre
								</label>
								<input
									className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
									placeholder="Juan"
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
									Apellido
								</label>
								<input
									className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
									placeholder="Pérez"
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
						<div className="grid sm:grid-cols-3 gap-4">
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">
									Género
								</label>
								<select
									className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
									{...register("gender")}
								>
									<option value="">Seleccionar</option>
									<option value="Masculino">Masculino</option>
									<option value="Femenino">Femenino</option>
									<option value="Otro">Otro</option>
								</select>
								{formState.errors.gender && (
									<p className="text-red-500 text-xs mt-1">
										{formState.errors.gender.message}
									</p>
								)}
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">
									Fecha de Nacimiento
								</label>
								<input
									type="date"
									className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
									{...register("birthDate")}
								/>
								{formState.errors.birthDate && (
									<p className="text-red-500 text-xs mt-1">
										{formState.errors.birthDate.message}
									</p>
								)}
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">
									Edad
								</label>
								<input
									type="number"
									className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
									placeholder="18"
									{...register("age")}
								/>
								{formState.errors.age && (
									<p className="text-red-500 text-xs mt-1">
										{formState.errors.age.message}
									</p>
								)}
							</div>
						</div>

						{/* Location & Phone Section */}
						<div className="grid sm:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">
									Nacionalidad
								</label>
								<select
									{...register("nationality")}
									className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
								>
									<option value="">Selecciona tu país</option>
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
									Teléfono
								</label>
								<div className="flex gap-2">
									<select
										{...register("phoneExtension")}
										className="w-24 px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shrink-0"
									>
										<option value="">Ext</option>
										{LATIN_AMERICAN_COUNTRIES.map((country) => (
											<option key={country.code} value={country.extension}>
												{country.flag} {country.extension}
											</option>
										))}
									</select>
									<input
										className="flex-1 px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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

						{/* Profile Image */}
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">
								Foto de perfil (URL)
							</label>
							<input
								className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
								type="url"
								placeholder="https://ejemplo.com/foto.jpg"
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
								<div className="w-full border-t border-slate-300"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-slate-500">
									Credenciales
								</span>
							</div>
						</div>

						{/* Email & Role */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div className="sm:col-span-2">
								<label className="block text-sm font-medium text-slate-700 mb-2">
									Correo electrónico
								</label>
								<input
									className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
									type="email"
									placeholder="tu@email.com"
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
									Rol
								</label>
								<select
									{...register("role")}
									className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shrink-0"
								>
									<option value="">...</option>
									<option value="student">Estudiante</option>
									<option value="householder">Arrendador</option>
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
									Contraseña
								</label>
								<div className="relative">
									<input
										className="w-full px-4 py-2.5 pr-16 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
											showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
										}
									>
										{showPassword ? "🙈" : "👁️"}
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
									Confirmar Contraseña
								</label>
								<div className="relative">
									<input
										className="w-full px-4 py-2.5 pr-16 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
												? "Ocultar contraseña"
												: "Mostrar contraseña"
										}
									>
										{showConfirmPassword ? "🙈" : "👁️"}
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
							className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 mt-6"
							type="submit"
							disabled={formState.isSubmitting || isPending}
						>
							{isPending ? "Creando cuenta..." : "Crear cuenta"}
						</button>
					</form>

					{/* Sign In Link */}
					<div className="mt-6 text-center">
						<p className="text-slate-600 text-sm">
							¿Ya tienes una cuenta?{" "}
							<a
								href="/login"
								className="text-blue-600 hover:text-blue-700 font-medium transition"
							>
								Inicia sesión
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Register;
