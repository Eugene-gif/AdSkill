import { defineStore } from "pinia";
import { Chat, Member } from "@/models/ChatModel";
import {
  Message,
  ReservedMessage,
  SentMessage,
} from "@/models/MessageModel";

interface ChatStoreState {
  chatEntity: Chat;
  memberList: Array<Member>;
  messages: Array<Message>;
  detailChatLoading: boolean;
  memberListLoading: boolean;
  isConnected: boolean;
}

export const useChatStore = defineStore("chat-stores", {
  state: (): ChatStoreState => ({
    chatEntity: {
      id: "",
      name: "",
      status: "",
      isReserved: false,
      avatar: "",
      attachments: [],
      members: [],
      job: "",
      files: [],
    },
    memberList: [],
    messages: [],
    detailChatLoading: true,
    memberListLoading: true,
    isConnected: true,
  }),
  getters: {
    getUnreadMessages(): Array<Message> {
      return this.messages.filter(
        (msg: any) => msg.status === "sent"
      );
    },
  },
  actions: {
    setMemberList(members: Array<Member>) {
      this.memberList = members;
    },
    setChatMessages(msgList: Array<Message>) {
      this.messages = msgList;
      this.messages.reverse();
    },
    reserveChat(chatInfo: ReservedMessage) {
      const chatID = chatInfo.data.chat.id;
      const memberID = chatInfo.data.member!.id;

      const currentMember = this.memberList.findIndex(
        (member: Member) => member.id === memberID
      );

      if (this.memberList.length) {
        this.memberList[currentMember].chats.forEach((chat: Chat) => {
          if (chat.id === chatID) {
            chat.isReserved = chatInfo.data.isReserved!;
          }
        });
      }
    },
    addNewMessage(msg: any) {
      // Добавление аттачментов во вложения чата
      if (msg.data.attachments.length) {
        this.chatEntity.attachments =
          this.chatEntity.attachments.concat(msg.data.attachments);
      }

      this.messages.push(msg.data);
    },
  },
});
