export interface ChatSummary {
	chatId: number;
	otherParticipantId: string;
	otherParticipantName: string;
	lastMessage: string | null;
	lastMessageAt: string | null;
	unreadCount: number;
	otherParticipantImageUrl: string;
}
