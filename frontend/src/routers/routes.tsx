import { createBrowserRouter } from "react-router";
import App from "../App";
import { confirmEmailLoader } from "../features/auth/loaders/ConfirmEmail.loader";
import ConfirmEmail from "../features/auth/pages/confirm-email";
import Login from "../features/auth/pages/login";
import Register from "../features/auth/pages/register";
import { useAccessToken } from "../features/auth/store/authStore";
import { getRoleFromAccessToken } from "../features/auth/utils/tokenClaims";
import { BookingsPage } from "../features/bookings/pages";
import { HomePage } from "../features/home/pages";
import { NewRoomPage } from "../features/new-room/pages";
import { NotFoundPage } from "../features/not-found/pages";
import { OwnerHomePage } from "../features/owner-home/pages";
import { OwnerRoomDetailsPage } from "../features/owner-room-details/pages";
import { ProfileSettings } from "../features/profile-settings/pages";
import { RoomDetails } from "../features/room-details/pages";
import { RoomsPage } from "../features/rooms/pages";
import { MainLayout } from "../layout/layout";
import GuestRoute from "./GuestRoute";
import { HouseholderProtectedRoute } from "./HouseholderProtectedRoute";
import ProtectedRoute from "./ProtectedRoute";
import { StudentProtectedRoute } from "./StudentProtectedRoute";

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
			{
				path: "confirm-email",
				loader: confirmEmailLoader,
				Component: ConfirmEmail,
			},

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
								path: "profile-settings",
								Component: ProfileSettings,
							},
							{
								path: "",
								Component: StudentProtectedRoute,
								children: [
									{
										path: "rooms",
										Component: RoomsPage,
									},
									{
										path: "bookings",
										Component: BookingsPage,
									},
									{
										path: "details/:id",
										Component: RoomDetails,
									},
								],
							},
							{
								path: "",
								Component: HouseholderProtectedRoute,
								children: [
									{
										path: "owner/rooms/new",
										Component: NewRoomPage,
									},
									{
										path: "owner/rooms/:id",
										Component: OwnerRoomDetailsPage,
									},
								],
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
