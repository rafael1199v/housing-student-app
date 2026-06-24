import type { Chat } from "../features/chat/types/chat";
import type { ChatSummary } from "../features/chat/types/chatSummary";
import type { Message } from "../features/chat/types/message";
import { api } from "./apiService";

export interface StartChatParams {
	roomId?: number;
	participantUserId?: string;
}

const chatService = {
	getChats: () => api.get<ChatSummary[]>("/api/chats"),

	getMessages: (chatId: number, beforeMessageId?: number, pageSize = 30) => {
		const query = new URLSearchParams({ pageSize: String(pageSize) });
		if (beforeMessageId !== undefined) {
			query.set("beforeMessageId", String(beforeMessageId));
		}
		return api.get<Message[]>(`/api/chats/${chatId}/messages?${query}`);
	},

	startChat: (params: StartChatParams) => api.post<Chat>("/api/chats", params),

	markRead: (chatId: number, lastMessageId: number) =>
		api.put<boolean>(`/api/chats/${chatId}/read`, { lastMessageId }),
};

export default chatService;
