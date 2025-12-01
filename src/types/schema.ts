import { z } from "zod";

export const ContentModeSchema = z.enum([
  "pre-race",
  "post-race",
  "trainer",
  "investor",
  "social",
]);

export const LayoutTypeSchema = z.enum([
  "auto",
  "visual",
  "editorial",
  "longform",
]);

export const DevicePreviewSchema = z.enum([
  "desktop",
  "tablet",
  "mobile",
]);

export const ContentDataSchema = z.object({
  headline: z.string().default(""),
  subheadline: z.string().default(""),
  body: z.string().default(""),
  quote: z.string().default(""),
  quoteAttribution: z.string().default(""),
  imageFile: z.custom<File>((v) => v instanceof File).nullable().default(null),
  imagePreview: z.string().nullable().default(null),
  caption: z.string().default(""),
});

export const AppSettingsSchema = z.object({
  mode: ContentModeSchema.default("pre-race"),
  includeQuote: z.boolean().default(true),
  includeImage: z.boolean().default(true),
  layoutType: LayoutTypeSchema.default("auto"),
  devicePreview: DevicePreviewSchema.default("desktop"),
  targetWordCount: z.number().default(150),
});

export type ContentData = z.infer<typeof ContentDataSchema>;
export type AppSettings = z.infer<typeof AppSettingsSchema>;
export type ContentMode = z.infer<typeof ContentModeSchema>;
export type LayoutType = z.infer<typeof LayoutTypeSchema>;
export type DevicePreview = z.infer<typeof DevicePreviewSchema>;

export const initialContent = ContentDataSchema.parse({});
export const initialSettings = AppSettingsSchema.parse({});
