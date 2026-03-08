import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
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
	const [nationality, setNationality] = useState("");
	const password = watch("password");

	const onSubmit: SubmitHandler<IFormInput> = (data) => {
		const newRegister: RegisterDto = {
			email: data.email,
			password: data.password,
			role: "student",
			firstName: data.firstName,
			lastName: data.lastName,
			phoneNumber: `${phoneExtension}${data.phoneNumber}`,
			nationality: nationality,
			age: data.age,
			gender: data.gender,
			imageUrl: data.imageUrl,
			birthdate: data.birthDate,
		};
		authService.register(newRegister);
		console.log(newRegister);
	};

	useEffect(() => {
		if (formState.isSubmitted) {
			reset({ password: "", confirmPassword: "" });
		}
	}, [formState, reset]);

	return (
		<div className="h-screen w-screen flex justify-center">
			<div className="w-full h-95/100 p-12 flex-col flex justify-around">
				<div className="flex justify-center">
					<a href="https://vite.dev" target="_blank">
						<img src={viteLogo} className="logo size-24" alt="Vite logo" />
					</a>
					<a href="https://react.dev" target="_blank">
						<img
							src={reactLogo}
							className="size-24 logo react"
							alt="React logo"
						/>
					</a>
				</div>
				<h1 className="text-center text-4xl">Registro</h1>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="flex flex-col space-y-3">
						<label className="">Nombre</label>
						<input
							className="rounded-md bg-gray-300 h-10 text-xl"
							{...register("firstName")}
						/>
						<label className="">Apellido</label>
						<input
							className="rounded-md bg-gray-300 h-10 text-xl"
							{...register("lastName")}
						/>
						<div className="flex flex-row justify-between">
							<div className="flex flex-col">
								<label className="">Nacionalidad</label>
								<select
									value={nationality}
									onChange={(e) => setNationality(e.target.value)}
									className="rounded-md bg-gray-300 h-10 text-xl px-3"
								>
									<option value="">Selecciona tu país</option>
									{LATIN_AMERICAN_COUNTRIES.map((country) => (
										<option key={country.code} value={country.code}>
											{country.flag} {country.name}
										</option>
									))}
								</select>
							</div>
							<div className="flex flex-col">
								<label className="">Teléfono</label>
								<div className="flex gap-3">
									<select
										value={phoneExtension}
										onChange={(e) => setPhoneExtension(e.target.value)}
										className="rounded-md bg-gray-300 h-10 text-xl px-2 shrink-0 w-32"
									>
										<option value="">Extensión</option>
										{LATIN_AMERICAN_COUNTRIES.map((country) => (
											<option key={country.code} value={country.extension}>
												{country.flag} {country.extension}
											</option>
										))}
									</select>
									<input
										className="rounded-md bg-gray-300 h-10 text-xl px-3 flex-1"
										type="tel"
										placeholder="Teléfono"
										{...register("phoneNumber")}
									/>
								</div>
							</div>
						</div>
						<div className="flex flex-row justify-between">
							<div className="flex flex-col">
								<label>Género</label>
								<select
									className="rounded-md bg-gray-300 h-10 text-xl px-3"
									{...register("gender")}
								>
									<option value="">Selecciona tu género</option>
									<option value="Masculino">Masculino</option>
									<option value="Femenino">Femenino</option>
									<option value="Otro">Otro</option>
								</select>
							</div>
							<div className="flex flex-col">
								<label>Fecha de Nacimiento</label>
								<input
									type="date"
									className="rounded-md bg-gray-300 h-10 text-xl"
									{...register("birthDate")}
								/>
							</div>
							<div className="flex flex-col">
								<label>Edad</label>
								<input
									type="number"
									className="rounded-md bg-gray-300 h-10 text-xl"
									{...register("age")}
								/>
							</div>
						</div>
						<label>Foto de perfil (URL)</label>
						<input
							className="rounded-md bg-gray-300 h-10 text-xl"
							{...register("imageUrl")}
						/>
						<label className="">Correo</label>
						<input
							className="rounded-md bg-gray-300 h-10 text-xl"
							{...register("email")}
						/>
						<label>Contraseña</label>
						<input
							className="rounded-md bg-gray-300 h-10 text-xl"
							type="password"
							{...register("password", {
								required: "La contraseña es requerida",
							})}
						/>
						{formState.errors.password && (
							<p className="text-red-600 text-sm">
								{formState.errors.password.message}
							</p>
						)}
						<label>Confirmar Contraseña</label>
						<input
							className="rounded-md bg-gray-300 h-10 text-xl"
							type="password"
							{...register("confirmPassword", {
								required: "Debe confirmar la contraseña",
								validate: (value) =>
									value === password || "Las contraseñas no coinciden",
							})}
						/>
						{formState.errors.confirmPassword && (
							<p className="text-red-600 text-sm">
								{formState.errors.confirmPassword.message}
							</p>
						)}
						<button
							className="rounded-md m-5 cursor-pointer font-medium text-2xl text-white bg-blue-700 w-full py-2 px-4 self-center"
							type="submit"
						>
							Enviar
						</button>
						<p className="m-2 text-center">No account?</p>
						<a className="m-2 text-center text-blue-700" href="register">
							Sign Up
						</a>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Register;
