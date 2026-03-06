import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, NavLink, Outlet } from "react-router";
import Login from "../features/auth/pages/login";
import Register from "../features/auth/pages/register";

function Root() {
	return (
		<>
			<Outlet />
		</>
	);
}

export const router = createBrowserRouter([
	{
		path: "/",
		Component: Root,
		children: [
			{
				path: "login",
				Component: Login,
			},
			{
				path: "register",
				Component: Register,
			},
		],
	},
]);
