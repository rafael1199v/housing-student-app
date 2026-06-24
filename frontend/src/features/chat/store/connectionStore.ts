import { create } from "zustand";

interface ChatConnectionState {
	isConnected: boolean;
	setConnected: (value: boolean) => void;
}

export const useChatConnectionStore = create<ChatConnectionState>((set) => ({
	isConnected: false,
	setConnected: (isConnected) => set({ isConnected }),
}));

export const useChatConnected = () =>
	useChatConnectionStore((state) => state.isConnected);
