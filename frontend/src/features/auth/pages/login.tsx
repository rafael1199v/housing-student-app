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
import { useAuthActions } from "../store/authStore";

const loginSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, "El email es requerido")
		.email("Por favor ingresa un email válido"),
	password: z
		.string()
		.min(1, "La contraseña es requerida")
		.min(8, "La contraseña debe tener al menos 8 caracteres"),
});

type IFormInput = z.infer<typeof loginSchema>;

function Login() {
	const [showPassword, setShowPassword] = useState(false);
	const { register, handleSubmit, formState } = useForm<IFormInput>({
		resolver: zodResolver(loginSchema),
	});
	const { setAccessToken } = useAuthActions();
	const navigate = useNavigate();

	const { mutate, isPending } = useMutation({
		mutationFn: authService.login,
		onSuccess: (response) => {
			setAccessToken(response.accessToken);
			toast.success("Bienvenido");
			navigate("/");
		},
		onError: () => {
			toast.error("Credenciales invalidas");
		},
	});

	const onSubmit: SubmitHandler<IFormInput> = (data) => {
		mutate({ email: data.email, password: data.password });
	};

	return (
		<div className="editorial-hero min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-md">
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
				<div className="rounded-2xl bg-surface-container-lowest p-8 shadow-2xl">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-3xl font-semibold text-slate-900 mb-2">
							Bienvenido
						</h1>
						<p className="text-slate-500 text-sm">Inicia sesión en tu cuenta</p>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
						{/* Email Input */}
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">
								Correo electrónico
							</label>
							<input
								className="field-filled w-full px-4 py-2.5"
								type="email"
								placeholder="tu@email.com"
								{...register("email", { required: "El email es requerido" })}
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
								Contraseña
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

						{/* Submit Button */}
						<button
							className="btn-primary mt-6 w-full"
							type="submit"
							disabled={isPending}
						>
							{isPending ? "Iniciando..." : "Iniciar sesión"}
						</button>
					</form>

					{/* Divider */}
					<div className="my-6 flex items-center">
						<div className="flex-1 border-t border-outline-variant/15"></div>
						<span className="px-3 text-xs text-slate-500">
							¿No tienes cuenta?
						</span>
						<div className="flex-1 border-t border-outline-variant/15"></div>
					</div>

					{/* Sign Up Link */}
					<a
						href="/register"
						className="block w-full rounded-full bg-secondary-fixed px-4 py-2.5 text-center font-medium text-on-secondary-fixed transition hover:brightness-95"
					>
						Crea una cuenta
					</a>
				</div>
			</div>
		</div>
	);
}

export default Login;
