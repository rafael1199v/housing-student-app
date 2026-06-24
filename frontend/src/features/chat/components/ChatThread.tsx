import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import UserPlaceholder from "../../../assets/user_image_placeholder.jfif";
import { useAccessToken } from "../../auth/store/authStore";
import { getUserIdFromAccessToken } from "../../auth/utils/tokenClaims";
import { useChats } from "../hooks/useChats";
import { useMarkChatRead } from "../hooks/useMarkChatRead";
import { useMessages } from "../hooks/useMessages";
import { useActiveChatStore } from "../store/activeChatStore";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";

interface ChatThreadProps {
	chatId: number;
	onBack: () => void;
}

export function ChatThread({ chatId, onBack }: ChatThreadProps) {
	const { t, i18n } = useTranslation();
	const myId = getUserIdFromAccessToken(useAccessToken());
	const setActiveChatId = useActiveChatStore((state) => state.setActiveChatId);
	const { mutate: markRead } = useMarkChatRead();

	const chat = useChats().data?.find((c) => c.chatId === chatId);
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
		useMessages(chatId);

	const messages = useMemo(
		() =>
			data?.pages
				.slice()
				.reverse()
				.flatMap((page) => page.slice().reverse()) ?? [],
		[data],
	);

	const scrollRef = useRef<HTMLDivElement>(null);
	const stickToBottomRef = useRef(true);
	const loadingOlderRef = useRef(false);
	const prevScrollHeightRef = useRef(0);

	useEffect(() => {
		setActiveChatId(chatId);
		return () => setActiveChatId(null);
	}, [chatId, setActiveChatId]);

	const newestId = messages.length
		? messages[messages.length - 1].id
		: undefined;
	useEffect(() => {
		if (newestId !== undefined) {
			markRead({ chatId, lastMessageId: newestId });
		}
	}, [chatId, newestId, markRead]);

	useLayoutEffect(() => {
		const el = scrollRef.current;
		if (!el || messages.length === 0) {
			return;
		}
		if (loadingOlderRef.current) {
			el.scrollTop = el.scrollHeight - prevScrollHeightRef.current;
			loadingOlderRef.current = false;
		} else if (stickToBottomRef.current) {
			el.scrollTop = el.scrollHeight;
		}
	}, [messages]);

	const handleScroll = () => {
		const el = scrollRef.current;
		if (!el) {
			return;
		}
		stickToBottomRef.current =
			el.scrollHeight - el.scrollTop - el.clientHeight < 120;
		if (el.scrollTop < 80 && hasNextPage && !isFetchingNextPage) {
			prevScrollHeightRef.current = el.scrollHeight;
			loadingOlderRef.current = true;
			fetchNextPage();
		}
	};

	return (
		<div className="flex h-full flex-col">
			<header className="flex items-center gap-3 border-b border-slate-200 p-3">
				<button
					type="button"
					onClick={onBack}
					aria-label={t("chat.back")}
					className="rounded-full p-1 text-slate-600 transition hover:bg-surface-container md:hidden"
				>
					<svg
						className="h-6 w-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>
				<img
					src={chat?.otherParticipantImageUrl || UserPlaceholder}
					alt=""
					onError={(event) => {
						event.currentTarget.src = UserPlaceholder;
					}}
					className="h-10 w-10 rounded-full object-cover"
				/>
				<p className="truncate font-semibold text-slate-900">
					{chat?.otherParticipantName ?? t("chat.conversation")}
				</p>
			</header>

			<div
				ref={scrollRef}
				onScroll={handleScroll}
				className="flex flex-1 flex-col gap-2 overflow-y-auto p-4"
			>
				{isFetchingNextPage && (
					<p className="py-2 text-center text-xs text-slate-400">
						{t("chat.loadingOlder")}
					</p>
				)}
				{isLoading ? (
					<p className="m-auto text-sm text-slate-400">{t("chat.loading")}</p>
				) : messages.length === 0 ? (
					<p className="m-auto text-sm text-slate-400">
						{t("chat.noMessages")}
					</p>
				) : (
					messages.map((message) => (
						<MessageBubble
							key={message.id}
							message={message}
							isMine={message.senderId === myId}
							locale={i18n.language}
						/>
					))
				)}
			</div>

			<MessageInput chatId={chatId} />
		</div>
	);
}
