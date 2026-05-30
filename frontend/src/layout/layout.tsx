import { useEffect, useState } from "react";
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
import { closeIcon, menuIcon } from "../shared/icons/ui-icons-dictionary";

interface NavItem {
	path: string;
	labelKey: string;
	match: "exact" | "prefix";
}

export function MainLayout() {
	const { t } = useTranslation();
	const { clearAll } = useAuthActions();
	const navigate = useNavigate();
	const location = useLocation();
	const token = useAccessToken();
	const role = getRoleFromAccessToken(token);
	const [open, setOpen] = useState(false);

	const navItems: NavItem[] = [
		...(role == RoleEnum.Student
			? [
					{ path: "/rooms", labelKey: "nav.rooms", match: "exact" as const },
					{
						path: "/bookings",
						labelKey: "nav.bookings",
						match: "exact" as const,
					},
				]
			: [
					{
						path: "/owner/rooms/new",
						labelKey: "nav.createRoom",
						match: "exact" as const,
					},
				]),
		{
			path: "/profile-settings",
			labelKey: "nav.profileSettings",
			match: "prefix" as const,
		},
	];

	const isActive = (item: NavItem) =>
		item.match === "prefix"
			? location.pathname.startsWith(item.path)
			: location.pathname === item.path;

	const handleLogout = async () => {
		await authService.logout();
		clearAll();
		toast.success(t("nav.loggedOut"));
		navigate("/login");
	};

	useEffect(() => {
		if (!open) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = previous;
		};
	}, [open]);

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
						{/* Botón de menú hamburguesa para móviles */}
						<button
							type="button"
							onClick={() => setOpen(true)}
							aria-label={t("nav.menu")}
							aria-expanded={open}
							className="rounded-full bg-surface-container-high p-2 text-slate-700 transition hover:bg-surface-container"
						>
							<img src={menuIcon} alt="" className="h-6 w-6" />
						</button>
					</section>
					<section className="not-md:hidden">
						{/* Botones para tablets y computadoras */}
						<div className="flex items-center gap-3">
							{navItems.map((item) => (
								<button
									key={item.path}
									type="button"
									onClick={() => navigate(item.path)}
									className={`rounded-full px-4 py-2 text-sm font-medium transition ${
										isActive(item)
											? "bg-primary text-on-primary"
											: "bg-surface-container-high text-slate-700 hover:bg-surface-container"
									}`}
								>
									{t(item.labelKey)}
								</button>
							))}
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
			</nav>

			{/* Menú desplegable de pantalla completa para móviles */}
			{open && (
				<div className="md:hidden fixed inset-0 z-50 flex flex-col bg-surface">
					<div className="flex items-center justify-between gap-4 px-6 py-4">
						<p
							className="cursor-pointer text-lg font-semibold text-slate-900"
							onClick={() => {
								navigate("/");
								setOpen(false);
							}}
						>
							Itersapiens
						</p>
						<button
							type="button"
							onClick={() => setOpen(false)}
							aria-label={t("nav.close")}
							className="rounded-full bg-surface-container-high p-2 text-slate-700 transition hover:bg-surface-container"
						>
							<img src={closeIcon} alt="" className="h-6 w-6" />
						</button>
					</div>

					<div className="flex flex-1 flex-col gap-3 overflow-y-auto px-6 py-4">
						{navItems.map((item) => (
							<button
								key={item.path}
								type="button"
								onClick={() => {
									navigate(item.path);
									setOpen(false);
								}}
								className={`w-full rounded-2xl px-5 py-4 text-left text-base font-medium transition ${
									isActive(item)
										? "bg-primary text-on-primary"
										: "bg-surface-container-high text-slate-700 hover:bg-surface-container"
								}`}
							>
								{t(item.labelKey)}
							</button>
						))}

						<LanguageSelector variant="accordion" />

						<button
							type="button"
							onClick={handleLogout}
							className="mt-auto w-full rounded-2xl bg-secondary-fixed px-5 py-4 text-center text-base font-medium text-on-secondary-fixed transition hover:brightness-95"
						>
							{t("nav.logout")}
						</button>
					</div>
				</div>
			)}

			<main className="mx-auto w-full max-w-6xl px-4 py-8">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
