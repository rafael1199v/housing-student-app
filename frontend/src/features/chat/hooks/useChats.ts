import { useQuery } from "@tanstack/react-query";
import chatService from "../../../services/chatService";
import { chatKeys } from "./queryKeys";

export function useChats() {
	return useQuery({
		queryKey: chatKeys.chats,
		queryFn: chatService.getChats,
	});
}
