import { z } from "zod";
import { 
  ContentDataSchema, 
  AppSettingsSchema, 
  ContentModeSchema, 
  LayoutTypeSchema, 
  DevicePreviewSchema,
  initialContent as schemaInitialContent,
  initialSettings as schemaInitialSettings
} from "./schema";

export * from "./schema";

export type TemplateType = 'visual' | 'editorial' | 'longform';

export type AssistantTargetField =
  | "headline"
  | "subheadline"
  | "body"
  | "quote"
  | "quoteAttribution"
  | "auto";

// Re-export types inferred from schema
export type ContentMode = z.infer<typeof ContentModeSchema>;
export type LayoutType = z.infer<typeof LayoutTypeSchema>;
export type DevicePreview = z.infer<typeof DevicePreviewSchema>;
export type ContentData = z.infer<typeof ContentDataSchema>;
export type AppSettings = z.infer<typeof AppSettingsSchema>;

// Alias StructuredFields to ContentData for backward compatibility
export type StructuredFields = ContentData;

export const initialContent: ContentData = schemaInitialContent;
export const initialSettings: AppSettings = schemaInitialSettings;
