import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RoomDraftPolicy = {
	id: number;
	description: string;
};

export type RoomDraftLocation = {
	lat: number;
	lng: number;
};

export interface RoomDraftState {
	currentStep: number;
	name: string;
	description: string;
	price: number | null;
	roomStatus: number;
	location: RoomDraftLocation | null;
	imageFileNames: string[];
	selectedServices: number[];
	policies: RoomDraftPolicy[];
	actions: RoomDraftActions;
}

export interface RoomDraftActions {
	setCurrentStep: (currentStep: number) => void;
	setDetails: (details: {
		name: string;
		description: string;
		price: number | null;
		roomStatus: number;
	}) => void;
	setLocation: (location: RoomDraftLocation | null) => void;
	setImageFileNames: (imageFileNames: string[]) => void;
	setSelectedServices: (services: number[]) => void;
	setPolicies: (policies: RoomDraftPolicy[]) => void;
	clearDraft: () => void;
}

const DEFAULT_DRAFT_STATE = {
	currentStep: 0,
	name: "",
	description: "",
	price: null,
	roomStatus: 1,
	location: null,
	imageFileNames: [] as string[],
	selectedServices: [] as number[],
	policies: [] as RoomDraftPolicy[],
};

export const useRoomDraftStore = create<RoomDraftState>()(
	persist(
		(set) => ({
			...DEFAULT_DRAFT_STATE,
			actions: {
				setCurrentStep: (currentStep) => set({ currentStep }),
				setDetails: (details) => set({ ...details }),
				setLocation: (location) => set({ location }),
				setImageFileNames: (imageFileNames) => set({ imageFileNames }),
				setSelectedServices: (selectedServices) => set({ selectedServices }),
				setPolicies: (policies) => set({ policies }),
				clearDraft: () => set({ ...DEFAULT_DRAFT_STATE }),
			},
		}),
		{
			name: "roomDraftStore",
			partialize: (state) => ({
				currentStep: state.currentStep,
				name: state.name,
				description: state.description,
				price: state.price,
				roomStatus: state.roomStatus,
				location: state.location,
				imageFileNames: state.imageFileNames,
				selectedServices: state.selectedServices,
				policies: state.policies,
			}),
		},
	),
);
