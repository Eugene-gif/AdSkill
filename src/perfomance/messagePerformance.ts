import {
  Message,
  ReadMessage,
  ReservedMessage,
  SentMessage,
} from "@/models/MessageModel";

function performSentMessage(
  chatID: string,
  message: string,
  memberID: string,
  agentID: string,
  attachmentsArr?: Array<{ id: string }>
): SentMessage {
  return {
    type: "chat.new_message",
    data: {
      chat: {
        id: chatID,
      },
      text: message,
      attachments: attachmentsArr!,
      member: {
        id: memberID,
      },
      agent: {
        id: agentID,
      },
    },
  };
}

function performReadMessage(
  chatID: string,
  messages: Array<Message>
): ReadMessage {
  return {
    type: "chat.read_messages",
    data: {
      chat: {
        id: chatID,
      },
      messages: messages.map((msg: any) => {
        return {
          id: msg.id,
        };
      }),
    },
  };
}

function performReservedMessage(
  chatID: string,
  memberID: string,
  agentID: string,
  status: boolean
): ReservedMessage {
  return {
    type: "chat.set_reserved",
    data: {
      chat: {
        id: chatID,
      },
      member: {
        id: memberID,
      },
      agent: {
        id: agentID,
      },
      isReserved: status,
    },
  };
}

export {
  performSentMessage,
  performReadMessage,
  performReservedMessage,
};
