import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRoomDraftStore } from "../store/roomDraftStore";
import { NewRoomPage } from "./index";

const navigateMock = vi.fn();
const confirmMock = vi.spyOn(window, "confirm");
const mutateMock = vi.fn();

const updateDraftState = (
	partial: Partial<ReturnType<typeof useRoomDraftStore.getState>>,
) => {
	useRoomDraftStore.setState((state) => ({ ...state, ...partial }));
};

vi.mock("react-i18next", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react-i18next")>();
	return {
		...actual,
		useTranslation: () => ({ t: (key: string) => key }),
	};
});

vi.mock("react-router", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react-router")>();
	return {
		...actual,
		useNavigate: () => navigateMock,
	};
});

vi.mock("@tanstack/react-query", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@tanstack/react-query")>();
	return {
		...actual,
		useMutation: () => ({ mutate: mutateMock, isPending: false }),
	};
});

vi.mock("../components/RoomDetailsStep", () => ({
	RoomDetailsStep: () => <div>RoomDetailsStep</div>,
}));

vi.mock("../components/ServicesPoliciesStep", () => ({
	ServicesPoliciesStep: () => <div>ServicesPoliciesStep</div>,
}));

vi.mock("../components/roomPreviewStep", () => ({
	RoomPreviewStep: () => <div>RoomPreviewStep</div>,
}));

vi.mock("../components/WizardProgress", () => ({
	WizardProgress: () => <div>WizardProgress</div>,
}));

vi.mock("../shared/createRoomSchema", () => ({
	createRoomSchema: {},
}));

vi.mock("@hookform/resolvers/zod", () => ({
	zodResolver: () => () => ({ values: {}, errors: {} }),
}));

vi.mock("../../../i18n", async (importOriginal) => {
	const actual = await importOriginal<typeof import("../../../i18n")>();
	return {
		...actual,
		t: (key: string) => key,
	};
});

vi.mock("react-hook-form", () => ({
	useForm: () => ({
		register: vi.fn(),
		handleSubmit: (fn: (values: unknown) => void) => () => {
			fn({
				name: "Room",
				description: "Nice room",
				price: 100,
				roomStatus: 1,
				latitude: -17.7,
				longitude: -63.1,
			});
		},
		trigger: vi.fn().mockResolvedValue(true),
		resetField: vi.fn(),
		setValue: vi.fn(),
		control: {},
		formState: { errors: {} },
	}),
	useWatch: ({ name }: { name: string }) => {
		const values: Record<string, unknown> = {
			name: "Room",
			description: "Nice room",
			price: 100,
			roomStatus: 1,
			latitude: -17.7,
			longitude: -63.1,
		};
		return values[name];
	},
}));

describe("NewRoomPage", () => {
	beforeEach(() => {
		navigateMock.mockReset();
		confirmMock.mockReset();
		mutateMock.mockReset();
		useRoomDraftStore.getState().actions.clearDraft();
	});

	it("navigates home on cancel when draft is empty", () => {
		const clearDraftSpy = vi.spyOn(
			useRoomDraftStore.getState().actions,
			"clearDraft",
		);
		render(<NewRoomPage />);

		fireEvent.click(screen.getAllByText("newRoom.cancelButton")[0]);

		expect(navigateMock).toHaveBeenCalledTimes(0);
		expect(clearDraftSpy).toHaveBeenCalledTimes(0);
	});

	it("asks for confirmation when draft has data and cancels if declined", () => {
		updateDraftState({
			name: "Draft",
			imageFileNames: ["draft.png"],
		});
		confirmMock.mockReturnValue(false);

		const clearDraftSpy = vi.spyOn(
			useRoomDraftStore.getState().actions,
			"clearDraft",
		);
		render(<NewRoomPage />);

		fireEvent.click(screen.getAllByText("newRoom.cancelButton")[0]);

		expect(navigateMock).not.toHaveBeenCalled();
		expect(clearDraftSpy).not.toHaveBeenCalled();
	});

	it("submits the form on the preview step", () => {
		updateDraftState({
			currentStep: 2,
			name: "Room",
			description: "Nice room",
			price: 100,
			roomStatus: 1,
			location: { lat: -17.7, lng: -63.1 },
		});

		render(<NewRoomPage />);

		fireEvent.click(screen.getAllByText("newRoom.submitButton")[0]);
		expect(mutateMock).toHaveBeenCalled();
	});
});
