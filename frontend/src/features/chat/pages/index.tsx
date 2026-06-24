import { useNavigate, useParams } from "react-router";
import { ChatList } from "../components/ChatList";
import { ChatThread } from "../components/ChatThread";
import { EmptyThread } from "../components/EmptyThread";

export function ChatPage() {
	const navigate = useNavigate();
	const { chatId: chatIdParam } = useParams<{ chatId: string }>();
	const chatId = chatIdParam ? Number(chatIdParam) : undefined;

	return (
		<div className="surface-card flex h-[calc(100vh-12rem)] min-h-[28rem] overflow-hidden">
			<div
				className={`w-full flex-col border-r border-slate-200 md:flex md:w-80 ${
					chatId ? "hidden md:flex" : "flex"
				}`}
			>
				<ChatList
					activeChatId={chatId}
					onSelect={(id) => navigate(`/messages/${id}`)}
				/>
			</div>

			<div className={`flex-1 flex-col ${chatId ? "flex" : "hidden md:flex"}`}>
				{chatId ? (
					<ChatThread
						key={chatId}
						chatId={chatId}
						onBack={() => navigate("/messages")}
					/>
				) : (
					<EmptyThread />
				)}
			</div>
		</div>
	);
}
