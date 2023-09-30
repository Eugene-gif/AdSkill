export interface Attachment {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttachmentWithType {
  id: string;
  mimeType: string;
  fileName?: string;
}
