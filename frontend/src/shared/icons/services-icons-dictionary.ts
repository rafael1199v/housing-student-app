import climateIcon from "../../assets/icons/services/climate_mini_split.svg";
import exerciseIcon from "../../assets/icons/services/exercise.svg";
import kitchenIcon from "../../assets/icons/services/kitchen.svg";
import routerIcon from "../../assets/icons/services/router.svg";
import tvIcon from "../../assets/icons/services/tv.svg";

interface Service {
	code: string;
	icon: string;
}

const SERVICE_ICONS: Service[] = [
	{ code: "service.tv", icon: tvIcon },
	{ code: "service.wifi", icon: routerIcon },
	{ code: "service.kitchen", icon: kitchenIcon },
	{ code: "service.gym-equipment", icon: exerciseIcon },
	{ code: "service.air-conditioner", icon: climateIcon },
];

export { SERVICE_ICONS };
export type { Service };
