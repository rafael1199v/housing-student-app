import {
	HubConnection,
	HubConnectionBuilder,
	HubConnectionState,
} from "@microsoft/signalr";
import { API_BASE_URL } from "../../../config/constants";
import { useAuthStore } from "../../auth/store/authStore";
import { useChatConnectionStore } from "../store/connectionStore";
import type { Chat } from "../types/chat";
import type { Message } from "../types/message";

const RECEIVE_MESSAGE = "ReceiveMessage";
const CHAT_CREATED = "ChatCreated";
const ERROR_EVENT = "Error";

let connection: HubConnection | null = null;

function setConnected(value: boolean): void {
	useChatConnectionStore.getState().setConnected(value);
}

function getConnection(): HubConnection {
	if (!connection) {
		connection = new HubConnectionBuilder()
			.withUrl(`${API_BASE_URL}/hubs/chat`, {
				accessTokenFactory: () => useAuthStore.getState().accessToken,
				withCredentials: false,
			})
			.withAutomaticReconnect()
			.build();

		connection.onreconnecting(() => setConnected(false));
		connection.onreconnected(() => setConnected(true));
		connection.onclose(() => setConnected(false));
	}
	return connection;
}

export async function startConnection(): Promise<void> {
	const conn = getConnection();
	if (conn.state === HubConnectionState.Disconnected) {
		await conn.start();
		setConnected(true);
	}
}

export async function stopConnection(): Promise<void> {
	if (connection) {
		const conn = connection;
		connection = null;
		setConnected(false);
		await conn.stop();
	}
}

export function sendMessage(chatId: number, message: string): Promise<void> {
	return getConnection().invoke("SendMessage", chatId, message);
}

export function joinChat(chatId: number): Promise<void> {
	return getConnection().invoke("JoinChat", chatId);
}

export function leaveChat(chatId: number): Promise<void> {
	return getConnection().invoke("LeaveChat", chatId);
}

export function onReceiveMessage(
	handler: (message: Message) => void,
): () => void {
	const conn = getConnection();
	conn.on(RECEIVE_MESSAGE, handler);
	return () => conn.off(RECEIVE_MESSAGE, handler);
}

export function onChatCreated(handler: (chat: Chat) => void): () => void {
	const conn = getConnection();
	conn.on(CHAT_CREATED, handler);
	return () => conn.off(CHAT_CREATED, handler);
}

export function onError(handler: (error: unknown) => void): () => void {
	const conn = getConnection();
	conn.on(ERROR_EVENT, handler);
	return () => conn.off(ERROR_EVENT, handler);
}

export function onReconnected(handler: () => void): void {
	getConnection().onreconnected(handler);
}
