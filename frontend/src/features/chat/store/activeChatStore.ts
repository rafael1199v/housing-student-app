import { create } from "zustand";

interface ActiveChatState {
	activeChatId: number | null;
	setActiveChatId: (chatId: number | null) => void;
}

export const useActiveChatStore = create<ActiveChatState>((set) => ({
	activeChatId: null,
	setActiveChatId: (activeChatId) => set({ activeChatId }),
}));

export const useActiveChatId = () =>
	useActiveChatStore((state) => state.activeChatId);
