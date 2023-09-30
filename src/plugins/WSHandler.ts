import App from "@/App.vue";
import {
  Message,
  ReservedMessage,
  SentMessage,
} from "@/models/MessageModel";
import { useChatStore } from "@/stores/chat-store";
import { inject } from "vue";
import { performReadMessage } from "@/perfomance/messagePerformance";

export function useBus(): WSHandler {
  return inject("bus")!;
}

// Типы событий
enum EventTypes {
  CHAT_RESERVED = "chat.set_reserved",
  CHAT_MESSAGE = "chat.new_message",
}

// export interface MessageBus {
//   connect(): void;
//
//   send(message: any): void;
//
//   close(code: number): void;
// }
// implements MessageBus

export class WSHandler {
  ws?: WebSocket | null = null;
  isConnected?: boolean;

  // #TODO: Выяснить почему ругается на App тип, как его подставить сюда
  install(app: any, ...options: unknown[]) {
    app.config.globalProperties.$bus = this;

    this.connect();

    app.provide("bus", this);
  }

  connect() {
    if (this.isConnected || !localStorage.getItem("accessToken"))
      return;

    // Pinia
    const chatStore = useChatStore();
    // Websocket соединение
    this.ws = new WebSocket(
      `${
        import.meta.env.VITE_API_WS_URL
      }/ws?Authorization=Bearer ${localStorage.getItem(
        "accessToken"
      )}`
    );

    this.ws.onmessage = (message: MessageEvent) => {
      const messageData: SentMessage | ReservedMessage = JSON.parse(
        message.data
      );

      switch (messageData.type) {
        case EventTypes.CHAT_MESSAGE:
          chatStore.addNewMessage(messageData);
          break;

        case EventTypes.CHAT_RESERVED:
          chatStore.reserveChat(messageData as ReservedMessage);
          break;
      }
    };

    this.ws.onopen = () => (this.isConnected = true);
  }

  send(message: any) {
    if (!this.isConnected) this.connect();

    this.ws!.send(JSON.stringify(message));
  }

  read(messages: Array<Message>, chatId: string) {
    const messageData = performReadMessage(chatId, messages);

    this.ws!.send(JSON.stringify(messageData));
  }

  close(code: number) {
    if (this.isConnected) {
      this.ws?.close(code);
    }
  }
}
