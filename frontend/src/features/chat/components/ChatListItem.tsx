import { useTranslation } from "react-i18next";
import UserPlaceholder from "../../../assets/user_image_placeholder.jfif";
import type { ChatSummary } from "../types/chatSummary";
import { formatListTimestamp } from "../utils/chatTime";

interface ChatListItemProps {
	chat: ChatSummary;
	isActive: boolean;
	onSelect: () => void;
}

export function ChatListItem({ chat, isActive, onSelect }: ChatListItemProps) {
	const { i18n } = useTranslation();
	const unread = chat.unreadCount > 0;

	return (
		<button
			type="button"
			onClick={onSelect}
			className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
				isActive ? "bg-surface-container" : "hover:bg-surface-container-low"
			}`}
		>
			<img
				src={chat.otherParticipantImageUrl || UserPlaceholder}
				alt=""
				onError={(event) => {
					event.currentTarget.src = UserPlaceholder;
				}}
				className="h-12 w-12 shrink-0 rounded-full object-cover"
			/>
			<div className="min-w-0 flex-1">
				<div className="flex items-center justify-between gap-2">
					<p
						className={`truncate ${
							unread
								? "font-semibold text-slate-900"
								: "font-medium text-slate-800"
						}`}
					>
						{chat.otherParticipantName}
					</p>
					{chat.lastMessageAt && (
						<span
							className={`shrink-0 text-xs ${
								unread ? "font-semibold text-primary" : "text-slate-400"
							}`}
						>
							{formatListTimestamp(chat.lastMessageAt, i18n.language)}
						</span>
					)}
				</div>
				<div className="mt-0.5 flex items-center justify-between gap-2">
					<p
						className={`truncate text-sm ${
							unread ? "font-medium text-slate-700" : "text-slate-500"
						}`}
					>
						{chat.lastMessage ?? ""}
					</p>
					{unread && (
						<span
							className="ml-2 h-2.5 w-2.5 shrink-0 rounded-full bg-primary"
							aria-hidden="true"
						/>
					)}
				</div>
			</div>
		</button>
	);
}
