// src/layout/layoutConfig.ts

import type { StructuredFields } from "../types";

export type LayoutType = "poster" | "editorial" | "longform";
export type HeaderStyle = "compact" | "standard" | "hero";
export type FooterEmphasis = "light" | "standard";
export type QuotePosition = "left" | "right" | "none";
export type WatermarkStyle = "subtle" | "off";

export interface LayoutConfig {
  layoutType: LayoutType;
  twoColumn: boolean;
  headlineSpansColumns: boolean;
  quotePosition: QuotePosition;
  headerStyle: HeaderStyle;
  footerEmphasis: FooterEmphasis;
  watermarkStyle: WatermarkStyle;
}

/**
 * Suggest a default layout based on word count + presence of visual/quote.
 */
export function suggestLayout(content: StructuredFields): LayoutConfig {
  const wordCount =
    (content.body ?? "")
      .split(/\s+/)
      .filter(Boolean).length;

  const hasVisual =
    !!content.featuredImageUrl ||
    !!content.imagePreview ||
    !!content.videoUrl ||
    !!content.rawEmbedHtml;

  const hasQuote = !!content.quote;

  let layoutType: LayoutType;

  if (wordCount < 200 && (hasVisual || hasQuote)) {
    layoutType = "poster";
  } else if (wordCount > 600) {
    layoutType = "longform";
  } else {
    layoutType = "editorial";
  }

  return {
    layoutType,
    twoColumn: layoutType !== "poster",
    headlineSpansColumns: layoutType !== "poster",
    quotePosition: hasQuote ? "right" : "none",
    headerStyle: layoutType === "poster" ? "hero" : "standard",
    footerEmphasis: "light",
    watermarkStyle: "subtle",
  };
}

/** Helpers for header/footer padding so all variants are centralised. */
export function headerPadding(style: HeaderStyle): string {
  switch (style) {
    case "compact":
      return "px-4 py-3";
    case "hero":
      return "px-6 py-6";
    case "standard":
    default:
      return "px-5 py-4";
  }
}

export function footerPadding(style: FooterEmphasis): string {
  switch (style) {
    case "light":
      return "px-4 py-3";
    case "standard":
    default:
      return "px-5 py-4";
  }
}
