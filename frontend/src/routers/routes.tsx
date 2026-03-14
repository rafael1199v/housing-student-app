import { createBrowserRouter } from "react-router";
import App from "../App";
import Login from "../features/auth/pages/login";
import Register from "../features/auth/pages/register";
import { HomePage } from "../features/home/pages";
import { NotFoundPage } from "../features/not-found/pages";
import { RoomDetails } from "../features/room-details/pages";
import { RoomsPage } from "../features/rooms/pages";
import { MainLayout } from "../layout/layout";
import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
	{
		path: "/",
		Component: App,
		children: [
			// Guest-only routes (redirect to / if already logged in)
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
				children: [
					{
						path: "",
						Component: MainLayout,
						children: [
							{
								index: true,
								Component: HomePage,
							},
							{
								path: "rooms",
								Component: RoomsPage,
							},
						],
					},
					{
						path: "details",
						Component: MainLayout,
						children: [
							{
								index: true,
								Component: RoomDetails,
							},
						],
					},
				],
			},
			// 404 wildcard (any unmatched routes redirect here)
			{ path: "*", Component: NotFoundPage },
		],
	},
]);
