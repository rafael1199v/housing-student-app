import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { NavLink } from "react-router";
import viteLogo from "/vite.svg";
import reactLogo from "../../../assets/react.svg";
import authService from "../../../services/authService";

interface IFormInput {
	email: string;
	password: string;
}

function Login() {
	const { register, handleSubmit, reset, formState } = useForm<IFormInput>();
	const onSubmit: SubmitHandler<IFormInput> = (data) => {
		authService.login(data.email, data.password);
		console.log(data);
	};

	useEffect(() => {
		if (formState.isSubmitted) {
			reset({ password: "" });
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
				<h1 className="text-center text-4xl">Inicio de sesión</h1>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="flex flex-col space-y-3">
						<label className="">Correo</label>
						<input
							className="rounded-md bg-gray-300 h-10 text-xl"
							{...register("email")}
						/>
						<label>Contraseña</label>
						<input
							className="rounded-md bg-gray-300 h-10 text-xl"
							type="password"
							{...register("password")}
						/>
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

export default Login;
