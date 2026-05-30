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

export interface RoomDraftSnapshot {
	currentStep: number;
	name: string;
	description: string;
	price: number | null;
	roomStatus: number;
	location: RoomDraftLocation | null;
	imageFileNames: string[];
	selectedServices: number[];
	policies: RoomDraftPolicy[];
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
	hydrate: (snapshot: Partial<RoomDraftSnapshot>) => void;
	clearDraft: () => void;
}

export interface RoomDraftState extends RoomDraftSnapshot {
	actions: RoomDraftActions;
}

const DEFAULT_DRAFT_STATE: RoomDraftSnapshot = {
	currentStep: 0,
	name: "",
	description: "",
	price: null,
	roomStatus: 1,
	location: null,
	imageFileNames: [],
	selectedServices: [],
	policies: [],
};

type DraftSet = (
	partial:
		| Partial<RoomDraftState>
		| ((state: RoomDraftState) => Partial<RoomDraftState>),
) => void;

function createDraftActions(set: DraftSet): RoomDraftActions {
	return {
		setCurrentStep: (currentStep) => set({ currentStep }),
		setDetails: (details) => set({ ...details }),
		setLocation: (location) => set({ location }),
		setImageFileNames: (imageFileNames) => set({ imageFileNames }),
		setSelectedServices: (selectedServices) => set({ selectedServices }),
		setPolicies: (policies) => set({ policies }),
		hydrate: (snapshot) => set({ ...DEFAULT_DRAFT_STATE, ...snapshot }),
		clearDraft: () => set({ ...DEFAULT_DRAFT_STATE }),
	};
}

/**
 * Persisted store backing the room creation wizard. The draft survives refreshes
 * so a householder can resume creating a room later.
 */
export const useRoomDraftStore = create<RoomDraftState>()(
	persist(
		(set) => ({
			...DEFAULT_DRAFT_STATE,
			actions: createDraftActions(set),
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

/**
 * Non-persisted store backing the room edit wizard. Edit sessions are hydrated
 * from the fetched room on mount and cleared on exit, so they never read from or
 * clobber the persisted creation draft above.
 */
export const useEditRoomDraftStore = create<RoomDraftState>()((set) => ({
	...DEFAULT_DRAFT_STATE,
	actions: createDraftActions(set),
}));
