import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import {
	useAccessToken,
	useAuthActions,
} from "../features/auth/store/authStore";
import { getRoleFromAccessToken } from "../features/auth/utils/tokenClaims";
import { RoleEnum } from "../global/enum/role";
import { authService } from "../services/authService";
import { Footer } from "../shared/components/footer";
import { LanguageSelector } from "../shared/components/LanguageSelector";

export function MainLayout() {
	const { t } = useTranslation();
	const { clearAll } = useAuthActions();
	const navigate = useNavigate();
	const location = useLocation();
	const token = useAccessToken();
	const role = getRoleFromAccessToken(token);
	const [open, setOpen] = useState(false);

	const handleLogout = async () => {
		await authService.logout();
		clearAll();
		toast.success(t("nav.loggedOut"));
		navigate("/login");
	};

	return (
		<div className="min-h-screen bg-surface">
			<nav className="glass-surface sticky top-0 z-30">
				<div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 md:px-4 py-4">
					<div className="flex items-center gap-3">
						<p
							className="cursor-pointer text-lg font-semibold text-slate-900"
							onClick={() => navigate("/")}
						>
							Itersapiens
						</p>
					</div>
					<section className="md:hidden">
						{/* Activar lista desplegable para móviles */}
						<button onClick={() => setOpen(!open)}>
							{!open ? t("nav.menu") : t("nav.close")}
						</button>
					</section>
					<section className="not-md:hidden">
						{/* Botones para tablets y computadoras */}
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
							<button
								type="button"
								onClick={() => navigate("/profile-settings")}
								className={`rounded-full px-4 py-2 text-sm font-medium transition ${
									location.pathname.startsWith("/profile-settings")
										? "bg-primary text-on-primary"
										: "bg-surface-container-high text-slate-700 hover:bg-surface-container"
								}`}
							>
								{t("nav.profileSettings")}
							</button>
							<LanguageSelector />
							<button
								type="button"
								onClick={handleLogout}
								className="rounded-full bg-secondary-fixed px-4 py-2 text-sm font-medium text-on-secondary-fixed transition hover:brightness-95"
							>
								{t("nav.logout")}
							</button>
						</div>
					</section>
				</div>
				{/* Lista desplegable para móviles */}
				{open && (
					<div className="md:hidden glass-surface absolute left-0 right-0 top-full z-30 flex flex-col items-center gap-3 px-6 py-4 shadow-lg">
						{role == RoleEnum.Student ? (
							<>
								<button
									type="button"
									onClick={() => {
										navigate("/rooms");
										setOpen(false);
									}}
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
									onClick={() => {
										navigate("/bookings");
										setOpen(false);
									}}
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
								onClick={() => {
									navigate("/owner/rooms/new");
									setOpen(false);
								}}
								className={`rounded-full px-4 py-2 text-sm font-medium transition ${
									location.pathname === "/owner/rooms/new"
										? "bg-primary text-on-primary"
										: "bg-surface-container-high text-slate-700 hover:bg-surface-container"
								}`}
							>
								{t("nav.createRoom")}
							</button>
						)}
						<button
							type="button"
							onClick={() => {
								navigate("/profile-settings");
								setOpen(false);
							}}
							className={`rounded-full px-4 py-2 text-sm font-medium transition ${
								location.pathname.startsWith("/profile-settings")
									? "bg-primary text-on-primary"
									: "bg-surface-container-high text-slate-700 hover:bg-surface-container"
							}`}
						>
							{t("nav.profileSettings")}
						</button>
						<div className="flex flex-row gap-3">
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
				)}
			</nav>

			<main className="mx-auto w-full max-w-6xl px-4 py-8">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
