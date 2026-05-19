import cleaningServices from "../../assets/icons/policies/cleaning_services.svg";
import garageCheck from "../../assets/icons/policies/garage_check.svg";
import listAltCheck from "../../assets/icons/policies/list_alt_check.svg";
import petsIcon from "../../assets/icons/policies/pets.svg";
import securityIcon from "../../assets/icons/policies/security.svg";

interface Policy {
	code: string;
	icon: string;
}

const POLICY_ICONS: Policy[] = [
	{
		code: "policy.rules",
		icon: listAltCheck,
	},
	{
		code: "policy.cleaning",
		icon: cleaningServices,
	},
	{ code: "policy.pets", icon: petsIcon },
	{ code: "policy.security", icon: securityIcon },
	{
		code: "policy.parking",
		icon: garageCheck,
	},
];

export { POLICY_ICONS };
export type { Policy };
