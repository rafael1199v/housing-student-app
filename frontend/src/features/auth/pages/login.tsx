import { useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import viteLogo from "/vite.svg";
import reactLogo from "../../../assets/react.svg";
import { useSignIn } from "../store/authStore";

interface IFormInput {
	email: string;
	password: string;
}

function Login() {
	const { register, handleSubmit, reset, formState } = useForm<IFormInput>();
	const signIn = useSignIn();
	const navigate = useNavigate();

	const onSubmit: SubmitHandler<IFormInput> = async (data) => {
		try {
			await signIn({ email: data.email, password: data.password });
			toast.success("Bienvenido");
			navigate("/index");
		} catch {
			toast.error("Credenciales invalidas");
		}
	};

	useEffect(() => {
		if (formState.isSubmitted) {
			reset({ password: "" });
		}
	}, [formState, reset]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
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
				<div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
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
								className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
							<input
								className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
								type="password"
								placeholder="••••••••"
								{...register("password", {
									required: "La contraseña es requerida",
								})}
							/>
							{formState.errors.password && (
								<p className="text-red-500 text-xs mt-1">
									{formState.errors.password.message}
								</p>
							)}
						</div>

						{/* Submit Button */}
						<button
							className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 mt-6"
							type="submit"
							disabled={formState.isSubmitting}
						>
							{formState.isSubmitting ? "Iniciando..." : "Iniciar sesión"}
						</button>
					</form>

					{/* Divider */}
					<div className="my-6 flex items-center">
						<div className="flex-1 border-t border-slate-200"></div>
						<span className="px-3 text-xs text-slate-500">
							¿No tienes cuenta?
						</span>
						<div className="flex-1 border-t border-slate-200"></div>
					</div>

					{/* Sign Up Link */}
					<a
						href="/register"
						className="block text-center w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium py-2.5 px-4 rounded-lg transition duration-200 border border-slate-200"
					>
						Crea una cuenta
					</a>
				</div>
			</div>
		</div>
	);
}

export default Login;
