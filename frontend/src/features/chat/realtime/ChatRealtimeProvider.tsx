import { type InfiniteData, useQueryClient } from "@tanstack/react-query";
import { type ReactNode, useEffect } from "react";
import { toast } from "sonner";
import i18n from "../../../i18n";
import { useAuthStore } from "../../auth/store/authStore";
import { getUserIdFromAccessToken } from "../../auth/utils/tokenClaims";
import { chatKeys } from "../hooks/queryKeys";
import * as chatHub from "../realtime/chatHub";
import { useActiveChatStore } from "../store/activeChatStore";
import type { ChatSummary } from "../types/chatSummary";
import type { Message } from "../types/message";

export function ChatRealtimeProvider({ children }: { children: ReactNode }) {
	const queryClient = useQueryClient();

	useEffect(() => {
		const appendToThread = (message: Message) => {
			queryClient.setQueryData<InfiniteData<Message[]>>(
				chatKeys.messages(message.chatId),
				(prev) => {
					if (!prev) {
						return prev;
					}
					const alreadyPresent = prev.pages.some((page) =>
						page.some((m) => m.id === message.id),
					);
					if (alreadyPresent) {
						return prev;
					}
					const [firstPage = [], ...rest] = prev.pages;
					return { ...prev, pages: [[message, ...firstPage], ...rest] };
				},
			);
		};

		const updateChatList = (message: Message) => {
			const chats = queryClient.getQueryData<ChatSummary[]>(chatKeys.chats);
			if (!chats?.some((chat) => chat.chatId === message.chatId)) {
				queryClient.invalidateQueries({ queryKey: chatKeys.chats });
				return;
			}

			const myId = getUserIdFromAccessToken(
				useAuthStore.getState().accessToken,
			);
			const isMine = message.senderId === myId;
			const isActive =
				useActiveChatStore.getState().activeChatId === message.chatId;

			queryClient.setQueryData<ChatSummary[]>(chatKeys.chats, (prev) => {
				if (!prev) {
					return prev;
				}
				const index = prev.findIndex((c) => c.chatId === message.chatId);
				if (index === -1) {
					return prev;
				}
				const current = prev[index];
				const updated: ChatSummary = {
					...current,
					lastMessage: message.message,
					lastMessageAt: message.createdAt,
					unreadCount:
						isMine || isActive ? current.unreadCount : current.unreadCount + 1,
				};
				const next = prev.filter((_, i) => i !== index);
				next.unshift(updated);
				return next;
			});
		};

		const unsubscribeReceive = chatHub.onReceiveMessage((message) => {
			appendToThread(message);
			updateChatList(message);
		});

		const unsubscribeChatCreated = chatHub.onChatCreated((chat) => {
			queryClient.invalidateQueries({ queryKey: chatKeys.chats });
			chatHub.joinChat(chat.chatId).catch(() => undefined);
		});

		const unsubscribeError = chatHub.onError((error) => {
			toast.error(
				typeof error === "string"
					? error
					: i18n.t("errors:fallback", { ns: "errors" }),
			);
		});

		chatHub.onReconnected(() => {
			queryClient.invalidateQueries({ queryKey: chatKeys.chats });
		});

		chatHub.startConnection().catch(() => undefined);

		return () => {
			unsubscribeReceive();
			unsubscribeChatCreated();
			unsubscribeError();
			chatHub.stopConnection().catch(() => undefined);
		};
	}, [queryClient]);

	return <>{children}</>;
}
