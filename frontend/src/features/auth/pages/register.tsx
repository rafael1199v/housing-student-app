import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import viteLogo from "/vite.svg";
import reactLogo from "../../../assets/react.svg";
import authService from "../../../services/authService";
import { LATIN_AMERICAN_COUNTRIES } from "../components/NationalitySelector";
import type { RegisterDto } from "../types/registerDto";

interface IFormInput {
	email: string;
	password: string;
	confirmPassword: string;
	role: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	phoneExtension: string;
	nationality: string;
	age: number;
	gender: string;
	imageUrl: string;
	birthDate: string;
}

function Register() {
	const { register, handleSubmit, reset, formState, watch } =
		useForm<IFormInput>();
	const [phoneExtension, setPhoneExtension] = useState("");
	const [role, setRole] = useState("");
	const [nationality, setNationality] = useState("");
	const password = watch("password");
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

	const onSubmit: SubmitHandler<IFormInput> = (data) => {
		const newRegister: RegisterDto = {
			email: data.email,
			password: data.password,
			role: role,
			firstName: data.firstName,
			lastName: data.lastName,
			phoneNumber: `${phoneExtension}${data.phoneNumber}`,
			nationality: nationality,
			age: data.age,
			gender: data.gender,
			imageUrl: data.imageUrl,
			birthdate: data.birthDate,
		};

		mutate(newRegister);
	};

	useEffect(() => {
		if (formState.isSubmitted) {
			reset({ password: "", confirmPassword: "" });
		}
	}, [formState, reset]);

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
									{...register("firstName", {
										required: "El nombre es requerido",
									})}
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
									{...register("lastName", {
										required: "El apellido es requerido",
									})}
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
									{...register("gender", {
										required: "El género es requerido",
									})}
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
									{...register("birthDate", {
										required: "La fecha de nacimiento es requerida",
									})}
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
									{...register("age", { required: "La edad es requerida" })}
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
									value={nationality}
									onChange={(e) => setNationality(e.target.value)}
									className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
								>
									<option value="">Selecciona tu país</option>
									{LATIN_AMERICAN_COUNTRIES.map((country) => (
										<option key={country.code} value={country.code}>
											{country.flag} {country.name}
										</option>
									))}
								</select>
								{!nationality && formState.isSubmitted && (
									<p className="text-red-500 text-xs mt-1">
										La nacionalidad es requerida
									</p>
								)}
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">
									Teléfono
								</label>
								<div className="flex gap-2">
									<select
										value={phoneExtension}
										onChange={(e) => setPhoneExtension(e.target.value)}
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
										{...register("phoneNumber", {
											required: "El teléfono es requerido",
										})}
									/>
								</div>
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

						{/* Email */}
						<div className="sm:grid-cols-2 gap-4">
							<label className="block text-sm font-medium text-slate-700 mb-2">
								Correo electrónico
							</label>
							<input
								className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
								type="email"
								placeholder="tu@email.com"
								{...register("email", {
									required: "El email es requerido",
									pattern: {
										value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
										message: "Por favor ingresa un email válido",
									},
								})}
							/>
							{formState.errors.email && (
								<p className="text-red-500 text-xs mt-1">
									{formState.errors.email.message}
								</p>
							)}
							<label className="block text-sm font-medium text-slate-700 mb-2">
								Rol
							</label>
							<select
								value={role}
								onChange={(e) => setRole(e.target.value)}
								className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shrink-0"
							>
								<option value="">...</option>
								<option value="student">Estudiante</option>
								<option value="householder">Arrendador</option>
							</select>
							{formState.errors.email && (
								<p className="text-red-500 text-xs mt-1">
									{formState.errors.email.message}
								</p>
							)}
						</div>

						{/* Passwords */}
						<div className="grid sm:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">
									Contraseña
								</label>
								<input
									className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
									type="password"
									placeholder="••••••••"
									{...register("password", {
										required: "La contraseña es requerida",
										minLength: {
											value: 8,
											message: "La contraseña debe tener al menos 8 caracteres",
										},
									})}
								/>
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
								<input
									className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
									type="password"
									placeholder="••••••••"
									{...register("confirmPassword", {
										required: "Debe confirmar la contraseña",
										validate: (value) =>
											value === password || "Las contraseñas no coinciden",
									})}
								/>
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
							disabled={formState.isSubmitting}
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
