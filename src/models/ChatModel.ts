import { SingleIDObject } from "@/models/SingleIDObject";
import { AttachmentWithType } from "@/models/CommonModel";

export interface Member {
  agents: Array<Agent>;
  avatar: string;
  chats: Array<Chat>;
  id: string;
  name: string;
}

export interface Chat {
  id: string;
  name: string;
  status: string;
  isReserved: boolean;
  avatar: string;
  icon?: SingleIDObject;
  attachments: Array<AttachmentWithType>;
  members: Array<Member>;
  job: string;
  files: [];
}
// Модель агента чата
interface Agent {
  id: string;
  type: string;
  uid: string;
}
