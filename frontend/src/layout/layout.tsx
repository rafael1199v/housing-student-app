import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import {
	useAccessToken,
	useAuthActions,
} from "../features/auth/store/authStore";
import { getRoleFromAccessToken } from "../features/auth/utils/tokenClaims";
import { Footer } from "../features/shared/components/footer";
import { LanguageSelector } from "../features/shared/components/LanguageSelector";
import { RoleEnum } from "../global/enum/role";

export function MainLayout() {
	const { t } = useTranslation();
	const { clearAll } = useAuthActions();
	const navigate = useNavigate();
	const location = useLocation();
	const token = useAccessToken();
	const role = getRoleFromAccessToken(token);

	const handleLogout = () => {
		clearAll();
		toast.success(t("nav.loggedOut"));
		navigate("/login");
	};

	return (
		<div className="min-h-screen bg-surface">
			<nav className="glass-surface sticky top-0 z-30">
				<div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
					<div className="flex items-center gap-3">
						<p
							className="cursor-pointer text-lg font-semibold text-slate-900"
							onClick={() => navigate("/")}
						>
							Itersapiens
						</p>
					</div>

					<div className="flex items-center gap-3">
						{role == RoleEnum.Student ? (
							<>
								<button
									type="button"
									onClick={() => navigate("/rooms")}
									className={`rounded-full px-4 py-2 text-sm font-medium transition ${
										location.pathname === "/rooms"
											? "bg-primary text-on-primary"
											: "bg-surface-container-high text-slate-700 hover:bg-surface-container"
									}`}
								>
									{t("nav.rooms")}
								</button>
								<button
									type="button"
									onClick={() => navigate("/bookings")}
									className={`rounded-full px-4 py-2 text-sm font-medium transition ${
										location.pathname === "/bookings"
											? "bg-primary text-on-primary"
											: "bg-surface-container-high text-slate-700 hover:bg-surface-container"
									}`}
								>
									{t("nav.bookings")}
								</button>
							</>
						) : (
							<button
								type="button"
								onClick={() => navigate("/owner/rooms/new")}
								className={`rounded-full px-4 py-2 text-sm font-medium transition ${
									location.pathname === "/owner/rooms/new"
										? "bg-primary text-on-primary"
										: "bg-surface-container-high text-slate-700 hover:bg-surface-container"
								}`}
							>
								{t("nav.createRoom")}
							</button>
						)}
						<LanguageSelector />
						<button
							type="button"
							onClick={handleLogout}
							className="rounded-full bg-secondary-fixed px-4 py-2 text-sm font-medium text-on-secondary-fixed transition hover:brightness-95"
						>
							{t("nav.logout")}
						</button>
					</div>
				</div>
			</nav>

			<main className="mx-auto w-full max-w-6xl px-4 py-8">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
