import {AxiosResponse} from "axios";
import apiClient from "../apiClient/apiClient";
import {useChatStore} from "@/stores/chat-store";
import {useBus, WSHandler} from "@/plugins/WSHandler";

// Websocket service
const bus: WSHandler = useBus();
// Хранилище
const chatStore = useChatStore();

export interface ChatService {
    get(): Promise<void>

    read(chatId: string): Promise<void>

    getMessages(chatID: string, page: number): Promise<void>
}

export class ChatRest implements ChatService {
    async get(): Promise<void> {
        const response: AxiosResponse = await apiClient.get(
            "/api/chats/members/self"
        );

        const res = await response.data;

        if (response.status === 400) throw new Error(res);

        chatStore.setMemberList(res.result);
        chatStore.memberListLoading = false;
    }

    async read(chatId: string): Promise<void> {
        const response: AxiosResponse = await apiClient.get(
            `/api/chats/${chatId}`
        );

        const res = await response.data;

        if (response.status === 400) throw new Error(res);

        chatStore.chatEntity = res.result.item;
    }

    async getMessages(chatID: string, page: number): Promise<void> {
        const response: AxiosResponse = await apiClient.get(
            `/api/chats/${chatID}/messages?page=${page}`
        );

        const res = await response.data;

        if (response.status === 400) throw new Error(res);

        chatStore.setChatMessages(res.result.items);

        chatStore.detailChatLoading = false;
    }
}
