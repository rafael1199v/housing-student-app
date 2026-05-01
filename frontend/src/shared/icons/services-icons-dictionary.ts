interface Service {
	code: string;
	icon: string;
}

const SERVICE_ICONS: Service[] = [
	{ code: "service.tv", icon: "../../assets/icons/services/tv.svg" },
	{ code: "service.wifi", icon: "../../assets/icons/services/router.svg" },
	{ code: "service.kitchen", icon: "../../assets/icons/services/kitchen.svg" },
	{
		code: "service.gym-equipment",
		icon: "../../assets/icons/services/exercise.svg",
	},
	{
		code: "service.air-conditioner",
		icon: "../../assets/icons/services/climate_mini_split.svg",
	},
];

export { SERVICE_ICONS };
export type { Service };
