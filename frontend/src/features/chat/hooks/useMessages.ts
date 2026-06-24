import { useInfiniteQuery } from "@tanstack/react-query";
import chatService from "../../../services/chatService";
import { chatKeys, MESSAGES_PAGE_SIZE } from "./queryKeys";

export function useMessages(chatId: number) {
	return useInfiniteQuery({
		queryKey: chatKeys.messages(chatId),
		queryFn: ({ pageParam }) =>
			chatService.getMessages(chatId, pageParam, MESSAGES_PAGE_SIZE),
		initialPageParam: undefined as number | undefined,
		getNextPageParam: (lastPage) => {
			if (lastPage.length < MESSAGES_PAGE_SIZE) {
				return undefined;
			}
			return lastPage[lastPage.length - 1]?.id;
		},
	});
}
