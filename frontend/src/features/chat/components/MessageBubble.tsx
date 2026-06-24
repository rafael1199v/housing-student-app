import type { Message } from "../types/message";
import { formatMessageTime } from "../utils/chatTime";

interface MessageBubbleProps {
	message: Message;
	isMine: boolean;
	locale: string;
}

export function MessageBubble({ message, isMine, locale }: MessageBubbleProps) {
	return (
		<div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
			<div
				className={`max-w-[75%] rounded-2xl px-4 py-2 ${
					isMine
						? "bg-primary text-on-primary"
						: "bg-surface-container-high text-slate-800"
				}`}
			>
				<p className="whitespace-pre-wrap break-words text-sm">
					{message.message}
				</p>
				<p
					className={`mt-1 text-right text-[10px] ${
						isMine ? "text-on-primary/70" : "text-slate-500"
					}`}
				>
					{formatMessageTime(message.createdAt, locale)}
				</p>
			</div>
		</div>
	);
}
