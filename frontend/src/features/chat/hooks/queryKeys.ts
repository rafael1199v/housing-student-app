export const chatKeys = {
	chats: ["chats"] as const,
	messages: (chatId: number) => ["chat-messages", chatId] as const,
};

export const MESSAGES_PAGE_SIZE = 30;
