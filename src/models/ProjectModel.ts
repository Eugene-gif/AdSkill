import { Platform } from "@/models/PlatformModel";
import { SingleIDObject } from "@/models/SingleIDObject";
import { Attachment } from "@/models/CommonModel";

export interface Project {
  id: string;
  name?: string;
  offerUrl?: string;
  text?: string;
  attachments?: Array<Attachment>;
  platforms?: Array<Platform>;
  createdAt?: string;
}
