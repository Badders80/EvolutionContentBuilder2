import type { AppSettings, ContentData, LayoutType } from "../types";

export type ResolvedLayoutType = Exclude<LayoutType, "auto">;

export function wordCount(text: string | null | undefined): number {
  if (!text) return 0;
  return text
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
}

export function getAutoLayoutType(content: ContentData): ResolvedLayoutType {
  const bodyWords = wordCount(content.body);
  const hasMedia =
    Boolean(content.imagePreview || content.featuredImageUrl) ||
    Boolean(content.videoUrl) ||
    Boolean(content.rawEmbedHtml);

  if (bodyWords < 120 && hasMedia) {
    return "visual";
  }

  if (bodyWords <= 400) {
    return "editorial";
  }

  return "longform";
}

export function determineTemplate(
  content: ContentData,
  settings: AppSettings
): ResolvedLayoutType {
  if (settings.layoutType !== "auto") {
    return settings.layoutType;
  }

  return getAutoLayoutType(content);
}
