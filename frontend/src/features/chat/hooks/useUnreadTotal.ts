import { useChats } from "./useChats";

export function useUnreadTotal(): number {
	const { data } = useChats();
	return data?.reduce((sum, chat) => sum + chat.unreadCount, 0) ?? 0;
}
