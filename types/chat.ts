export interface Message {
  id?: string | number;
  message: string;
  timestamp: string;
  sender: "assistant" | "child" | "user";
  activityId?: number;
  childId?: number;
  metadata?: {
    [key: string]: any;
  };
  status?: MessageStatus;
  attachments?: Attachment[];
}

export enum MessageStatus {
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
  FAILED = "failed",
}

export interface Attachment {
  id: string | number;
  type: "image" | "document" | "audio" | "video";
  url: string;
  name?: string;
  size?: number;
  mimeType?: string;
  thumbnail?: string;
  width?: number;
  height?: number;
  duration?: number;
}

export interface Conversation {
  id: number;
  messages: Message[];
  title?: string;
  activityId: number;
  childId: number;
  assistant: string;
  date: string;
  status?: ConversationStatus;
  metadata?: {
    [key: string]: any;
  };
}

export enum ConversationStatus {
  ACTIVE = "active",
  ARCHIVED = "archived",
  DELETED = "deleted",
}

export interface AssistantTheme {
  colors: string[];
  icon: string;
}
