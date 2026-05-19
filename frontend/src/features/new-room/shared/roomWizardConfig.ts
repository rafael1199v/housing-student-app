import { POLICY_ICONS } from "../../../shared/icons/policy-icons-dictionary";
import { SERVICE_ICONS } from "../../../shared/icons/services-icons-dictionary";

export const MAX_IMAGES = 5;
export const DEFAULT_MAP_CENTER = { lat: -17.695442, lng: -63.150744 };

export const ROOM_STATUS_OPTIONS = [
	{ value: 1, labelKey: "newRoom.statusAvailable" },
	{ value: 2, labelKey: "newRoom.statusUnavailable" },
] as const;

const SERVICE_ICON_BY_CODE = new Map(
	SERVICE_ICONS.map((service) => [service.code, service.icon]),
);

const POLICY_ICON_BY_CODE = new Map(
	POLICY_ICONS.map((policy) => [policy.code, policy.icon]),
);

const ROOM_SERVICE_BASE_OPTIONS = [
	{
		id: 1,
		code: "service.tv",
		labelKey: "newRoom.services.tv.label",
		descriptionKey: "newRoom.services.tv.description",
	},
	{
		id: 2,
		code: "service.wifi",
		labelKey: "newRoom.services.wifi.label",
		descriptionKey: "newRoom.services.wifi.description",
	},
	{
		id: 3,
		code: "service.kitchen",
		labelKey: "newRoom.services.kitchen.label",
		descriptionKey: "newRoom.services.kitchen.description",
	},
	{
		id: 4,
		code: "service.gym-equipment",
		labelKey: "newRoom.services.gymEquipment.label",
		descriptionKey: "newRoom.services.gymEquipment.description",
	},
	{
		id: 5,
		code: "service.air-conditioner",
		labelKey: "newRoom.services.airConditioner.label",
		descriptionKey: "newRoom.services.airConditioner.description",
	},
] as const;

export const ROOM_SERVICE_OPTIONS = ROOM_SERVICE_BASE_OPTIONS.map(
	(service) => ({
		...service,
		icon: SERVICE_ICON_BY_CODE.get(service.code) ?? "",
	}),
);

const ROOM_POLICY_BASE_OPTIONS = [
	{
		id: 1,
		code: "policy.rules",
		labelKey: "newRoom.policies.rules.label",
		descriptionKey: "newRoom.policies.rules.description",
	},
	{
		id: 2,
		code: "policy.cleaning",
		labelKey: "newRoom.policies.cleaning.label",
		descriptionKey: "newRoom.policies.cleaning.description",
	},
	{
		id: 3,
		code: "policy.pets",
		labelKey: "newRoom.policies.pets.label",
		descriptionKey: "newRoom.policies.pets.description",
	},
	{
		id: 4,
		code: "policy.security",
		labelKey: "newRoom.policies.security.label",
		descriptionKey: "newRoom.policies.security.description",
	},
	{
		id: 5,
		code: "policy.parking",
		labelKey: "newRoom.policies.parking.label",
		descriptionKey: "newRoom.policies.parking.description",
	},
] as const;

export const ROOM_POLICY_OPTIONS = ROOM_POLICY_BASE_OPTIONS.map((policy) => ({
	...policy,
	icon: POLICY_ICON_BY_CODE.get(policy.code) ?? "",
}));

export const WIZARD_STEPS = [
	{
		id: 0,
		number: "1",
		titleKey: "newRoom.steps.details.title",
		descriptionKey: "newRoom.steps.details.description",
	},
	{
		id: 1,
		number: "2",
		titleKey: "newRoom.steps.amenities.title",
		descriptionKey: "newRoom.steps.amenities.description",
	},
	{
		id: 2,
		number: "3",
		titleKey: "newRoom.steps.preview.title",
		descriptionKey: "newRoom.steps.preview.description",
	},
] as const;

export type WizardStep = (typeof WIZARD_STEPS)[number];
export type RoomServiceOption = (typeof ROOM_SERVICE_OPTIONS)[number];
export type RoomPolicyOption = (typeof ROOM_POLICY_OPTIONS)[number];
export type MapPosition = { lat: number; lng: number };

export const getNextAvailableServiceId = (selectedServices: number[]) =>
	ROOM_SERVICE_OPTIONS.find((option) => !selectedServices.includes(option.id))
		?.id ?? "";
