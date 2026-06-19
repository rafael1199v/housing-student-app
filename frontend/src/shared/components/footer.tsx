import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useRoles } from "../../features/auth/hooks/useRoles";
import { useAuthActions } from "../../features/auth/store/authStore";
import { RoleEnum } from "../../global/enum/role";

export function Footer() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { clearAll } = useAuthActions();
	const { activeRole } = useRoles();
	const handleLogout = () => {
		clearAll();
		toast.success(t("nav.loggedOut"));
		navigate("/login");
	};
	return (
		<footer className="w-full bg-surface-container-low p-6 shadow-sm">
			<div className="mt-4 grid gap-6 md:grid-cols-2">
				<div className="items-center flex flex-nowrap flex-col">
					<p className="text-sm font-medium text-slate-700">
						{t("footer.contactInfo")}
					</p>
					<p className="mt-2 text-sm text-slate-600">
						{t("footer.contactEmail")}
					</p>
					<p className="text-sm text-slate-600">{t("footer.contactPhone")}</p>
				</div>
				<div className="items-center flex flex-nowrap flex-col">
					<p className="text-sm font-medium text-slate-700">
						{t("footer.pages")}
					</p>
					<div className="mt-2 flex flex-wrap gap-2">
						<button
							type="button"
							onClick={() => navigate("/")}
							className="rounded-full bg-surface-container-high px-3 py-1.5 text-sm text-slate-700 transition hover:bg-surface-container"
						>
							{t("footer.home")}
						</button>
						{activeRole === RoleEnum.Student ? (
							<>
								<button
									type="button"
									onClick={() => navigate("/rooms")}
									className="rounded-full bg-surface-container-high px-3 py-1.5 text-sm text-slate-700 transition hover:bg-surface-container"
								>
									{t("nav.rooms")}
								</button>
								<button
									type="button"
									onClick={() => navigate("/bookings")}
									className="rounded-full bg-surface-container-high px-3 py-1.5 text-sm text-slate-700 transition hover:bg-surface-container"
								>
									{t("nav.bookings")}
								</button>
							</>
						) : (
							<button
								type="button"
								onClick={() => navigate("/owner/rooms/new")}
								className="rounded-full bg-surface-container-high px-3 py-1.5 text-sm text-slate-700 transition hover:bg-surface-container"
							>
								{t("nav.createRoom")}
							</button>
						)}
						<button
							type="button"
							onClick={handleLogout}
							className="rounded-full bg-secondary-fixed px-3 py-1.5 text-sm text-on-secondary-fixed transition hover:brightness-95"
						>
							{t("nav.logout")}
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
}
