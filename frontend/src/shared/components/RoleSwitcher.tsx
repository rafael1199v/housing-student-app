import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useRoles } from "../../features/auth/hooks/useRoles";
import { RoleEnum } from "../../global/enum/role";

interface RoleSwitcherProps {
	variant?: "default" | "accordion";
}

export function RoleSwitcher({ variant = "default" }: RoleSwitcherProps) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { heldRoles, activeRole, setActiveRole } = useRoles();

	if (heldRoles.length <= 1) {
		return null;
	}

	const handleChange = (role: RoleEnum) => {
		setActiveRole(role);
		navigate("/");
	};

	const selectClasses =
		variant === "accordion"
			? "w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base font-medium text-slate-700"
			: "rounded-full border border-slate-300 bg-surface-container-high px-4 py-2 text-sm font-medium text-slate-700";

	return (
		<label className="flex items-center gap-2">
			<span className="sr-only">{t("nav.roleSwitcher")}</span>
			<select
				value={activeRole ?? ""}
				onChange={(event) => handleChange(event.target.value as RoleEnum)}
				aria-label={t("nav.roleSwitcher")}
				className={selectClasses}
			>
				{heldRoles.map((role) => (
					<option key={role} value={role}>
						{t(`roles.${role}`)}
					</option>
				))}
			</select>
		</label>
	);
}
