import { initialContent, type ContentData } from "./types/index";

export type SectionId = "create" | "saved" | "history" | "templates" | "settings";

export type Role = "system" | "user" | "assistant";

export interface AIMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
}

export interface SavedBuild {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  section: SectionId;
  model: string;
  messages: AIMessage[];
  structured: ContentData;
}

export const EMPTY_STRUCTURED = initialContent;

export * from "./types/index";
