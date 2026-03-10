import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { createBrowserRouter, Outlet } from "react-router";
import Login from "../features/auth/pages/login";
import Register from "../features/auth/pages/register";

function Root() {
	return (
		<QueryClientProvider client={new QueryClient()}>
			<Outlet />
		</QueryClientProvider>
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
			{
				path: "index",
				// Component: Index,
			},
		],
	},
]);
