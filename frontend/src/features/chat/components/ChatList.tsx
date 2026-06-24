import { useTranslation } from "react-i18next";
import { useChats } from "../hooks/useChats";
import { ChatListItem } from "./ChatListItem";

interface ChatListProps {
	activeChatId?: number;
	onSelect: (chatId: number) => void;
}

export function ChatList({ activeChatId, onSelect }: ChatListProps) {
	const { t } = useTranslation();
	const { data, isLoading, isError } = useChats();

	return (
		<div className="flex h-full flex-col">
			<header className="border-b border-slate-200 p-4">
				<h1 className="text-lg font-semibold text-slate-900">
					{t("chat.title")}
				</h1>
			</header>

			<div className="flex-1 overflow-y-auto">
				{isLoading && (
					<p className="p-4 text-sm text-slate-400">{t("chat.loading")}</p>
				)}
				{isError && (
					<p className="p-4 text-sm text-tertiary">{t("chat.loadError")}</p>
				)}
				{data?.length === 0 && (
					<p className="p-4 text-sm text-slate-400">{t("chat.empty")}</p>
				)}
				{data?.map((chat) => (
					<ChatListItem
						key={chat.chatId}
						chat={chat}
						isActive={chat.chatId === activeChatId}
						onSelect={() => onSelect(chat.chatId)}
					/>
				))}
			</div>
		</div>
	);
}
