import { createBrowserRouter } from "react-router";
import App from "../App";
import Login from "../features/auth/pages/login";
import Register from "../features/auth/pages/register";
import { useAccessToken } from "../features/auth/store/authStore";
import { getRoleFromAccessToken } from "../features/auth/utils/tokenClaims";
import { HomePage } from "../features/home/pages";
import { NewRoomPage } from "../features/new-room/pages";
import { NotFoundPage } from "../features/not-found/pages";
import { OwnerHomePage } from "../features/owner-home/pages";
import { OwnerRoomDetailsPage } from "../features/owner-room-details/pages";
import { RoomDetails } from "../features/room-details/pages";
import { RoomsPage } from "../features/rooms/pages";
import { MainLayout } from "../layout/layout";
import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";

function HomeRoutePage() {
	const accessToken = useAccessToken();
	const role = getRoleFromAccessToken(accessToken);

	if (role === "Householder") {
		return <OwnerHomePage />;
	}

	return <HomePage />;
}

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
								Component: HomeRoutePage,
							},
							{
								path: "rooms",
								Component: RoomsPage,
							},
						],
					},
					{
						path: "details/:id",
						Component: MainLayout,
						children: [
							{
								index: true,
								Component: RoomDetails,
							},
						],
					},
					{
						path: "owner/rooms/new",
						Component: MainLayout,
						children: [
							{
								index: true,
								Component: NewRoomPage,
							},
						],
					},
					{
						path: "owner/rooms/:id",
						Component: MainLayout,
						children: [
							{
								index: true,
								Component: OwnerRoomDetailsPage,
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
