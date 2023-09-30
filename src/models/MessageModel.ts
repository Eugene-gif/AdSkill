import { SingleIDObject } from "@/models/SingleIDObject";
import { Attachment, AttachmentWithType } from "@/models/CommonModel";

export interface Message {
  agent: SingleIDObject;
  attachments: Array<AttachmentWithType>;
  createdAt: string;
  id: string;
  member: MessageMember | SingleIDObject;
  status: string;
  text: string;
  updatedAt: string;
}

export interface EventMessage {
  type: string;
  data: MessageData;
}

export interface SentMessage {
  type: string;
  data: {
    text: string;
    chat: SingleIDObject;
    agent: SingleIDObject;
    member: SingleIDObject;
    attachments: Array<Attachment> | [];
  };
}

export interface ReservedMessage {
  type: string;
  data: {
    chat: SingleIDObject;
    member: SingleIDObject;
    agent: SingleIDObject;
    isReserved: boolean;
  };
}

export interface ReadMessage {
  type: string;
  data: {
    chat: SingleIDObject;
    messages: Array<SingleIDObject>;
  };
}

export interface MessageData {
  id: string;
  text: string;
  chat: SingleIDObject;
  agent: SingleIDObject;
  member: SingleIDObject;
  attachments: Array<AttachmentWithType>;
}

interface MessageMember {
  avatar: string | null;
  createdAt: string;
  id: string;
  name: string | null;
  type: string;
  updatedAt: string;
}
