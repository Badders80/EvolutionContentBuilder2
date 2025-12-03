export function getRightColumnClasses(): string {
  // right column: flex, gap, responsive spacing
  return "flex flex-col gap-6";
}

export function getPullQuoteClasses(): string {
  // pull-quote: centered, tight, responsive
  return "cursor-pointer text-center";
}
/** Tokenised Tailwind helpers for layout areas */
export function getFooterClasses(config: LayoutConfig): string {
  // width: locked token
  const width = "w-full"; // or "w-full max-w-4xl mx-auto"
  // height: driven by footerEmphasis
  const padding =
    config.footerEmphasis === "standard"
      ? "px-5 py-36"
      : "px-4 py-27";
  return `${width} ${padding}`;
}

export function getHeaderClasses(config: LayoutConfig): string {
  // width: locked token
  const width = "w-full";
  // padding: driven by headerStyle
  let padding = "px-5 py-4";
  if (config.headerStyle === "compact") padding = "px-4 py-3";
  if (config.headerStyle === "hero") padding = "px-6 py-6";
  return `${width} ${padding}`;
}

export function getBodyColumnClasses(): string {
  // width: locked token
  return "editorial-body cursor-pointer space-y-4 text-sm leading-relaxed md:text-base";
}
// src/layout/layoutConfig.ts

import type { StructuredFields } from "../types";

export type LayoutType = "poster" | "editorial" | "longform";
export type HeaderStyle = "compact" | "standard" | "hero";
export type FooterEmphasis = "light" | "standard";
export type EmbedStyle = "fullHeightCard" | "inlineThumbnail";
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
  embedStyle: EmbedStyle;
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
    embedStyle: "fullHeightCard",
  };
}

/** Helper for embed card classes based on layout config. */
export function getEmbedCardClasses(config: LayoutConfig): string {
  if (config.embedStyle === "inlineThumbnail") {
    return "relative w-full max-w-md rounded-lg border border-slate-200 bg-slate-50 p-3";
  }
  // default full height card
  return "flex-1 relative w-full max-h-[480px] rounded-xl border border-slate-200 bg-slate-50 p-4";
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
      return "px-4 py-9"; // tripled from py-3
    case "standard":
    default:
      return "px-5 py-12"; // tripled from py-4
  }
}
