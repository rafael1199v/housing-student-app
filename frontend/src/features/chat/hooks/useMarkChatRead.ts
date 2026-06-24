import { useMutation, useQueryClient } from "@tanstack/react-query";
import chatService from "../../../services/chatService";
import type { ChatSummary } from "../types/chatSummary";
import { chatKeys } from "./queryKeys";

interface MarkReadVars {
	chatId: number;
	lastMessageId: number;
}

export function useMarkChatRead() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ chatId, lastMessageId }: MarkReadVars) =>
			chatService.markRead(chatId, lastMessageId),
		onSuccess: (_result, { chatId }) => {
			queryClient.setQueryData<ChatSummary[]>(chatKeys.chats, (prev) =>
				prev?.map((chat) =>
					chat.chatId === chatId ? { ...chat, unreadCount: 0 } : chat,
				),
			);
		},
	});
}
