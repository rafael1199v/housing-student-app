interface Policy {
	code: string;
	icon: string;
}

const POLICY_ICONS: Policy[] = [
	{
		code: "policy.rules",
		icon: "../../assets/icons/policies/list_alt_check.svg",
	},
	{
		code: "policy.cleaning",
		icon: "../../assets/icons/policies/cleaning_services.svg",
	},
	{ code: "policy.pets", icon: "../../assets/icons/policies/pets.svg" },
	{ code: "policy.security", icon: "../../assets/icons/policies/security.svg" },
	{
		code: "policy.parking",
		icon: "../../assets/icons/policies/garage_check.svg",
	},
];

export { POLICY_ICONS };
export type { Policy };
