import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, Navigate, Outlet } from "react-router";
import App from "../App";
import Home from "../features/auth/pages/home";
import Login from "../features/auth/pages/login";
import Register from "../features/auth/pages/register";
import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
	{
		path: "/",
		Component: App,
		children: [
			// Redirect "/" to "/login"
			{ index: true, element: <Navigate to="/login" replace /> },

			// Guest-only routes (redirect to /index if already logged in)
			{
				Component: GuestRoute,
				children: [
					{ path: "login", Component: Login },
					{ path: "register", Component: Register },
				],
			},

			// Protected routes (redirect to /login if not logged in)
			{
				Component: ProtectedRoute,
				children: [{ path: "index", Component: Home }],
			},
		],
	},
]);
