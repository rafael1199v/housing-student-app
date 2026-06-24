import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { sendMessage } from "../realtime/chatHub";
import { useChatConnected } from "../store/connectionStore";

interface MessageInputProps {
	chatId: number;
}

export function MessageInput({ chatId }: MessageInputProps) {
	const { t } = useTranslation();
	const [text, setText] = useState("");
	const isConnected = useChatConnected();

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		const trimmed = text.trim();
		if (!trimmed || !isConnected) {
			return;
		}
		setText("");
		try {
			await sendMessage(chatId, trimmed);
		} catch {
			setText(trimmed);
			toast.error(t("chat.sendError"));
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex items-center gap-2 border-t border-slate-200 p-3"
		>
			<input
				type="text"
				value={text}
				onChange={(event) => setText(event.target.value)}
				placeholder={t("chat.inputPlaceholder")}
				className="field-filled flex-1"
				aria-label={t("chat.inputPlaceholder")}
			/>
			<button
				type="submit"
				className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
				disabled={!isConnected || text.trim().length === 0}
			>
				{t("chat.send")}
			</button>
		</form>
	);
}
